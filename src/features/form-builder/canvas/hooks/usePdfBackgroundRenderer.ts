'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import { loadPdfDocument, renderPdfPageToBlobUrl } from '@/lib/pdf-client/pdf-extractor';

/**
 * Hook tự động lazy render trang PDF nền khi:
 * 1. Form có `backgroundPdf.fileKey` (từ DB hoặc vừa lưu/nạp)
 * 2. ActivePage có `pdfPageNumber` nhưng chưa có `backgroundUrl` (sau khi F5 / mở lại form)
 *
 * Hook này cache các Blob URL đã render và giải phóng (revoke) khi unmount hoặc đổi file.
 * Gọi setTransientPageBackground để KHÔNG kích hoạt history và KHÔNG bật dirty state.
 */
export function usePdfBackgroundRenderer() {
  const backgroundPdf = useFormBuilderStore((state) => state.backgroundPdf);
  const activePageId = useFormBuilderStore((state) => state.activePageId);
  const pages = useFormBuilderStore((state) => state.pages);
  const setTransientPageBackground = useFormBuilderStore(
    (state) => state.setTransientPageBackground,
  );

  const activePage = pages.find((p) => p.id === activePageId);
  const activePdfPageNum = activePage?.pdfPageNumber;
  const hasBgUrl = Boolean(activePage?.backgroundUrl);

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const loadingDocKeyRef = useRef<string | null>(null);
  const blobCacheRef = useRef<Map<number, string>>(new Map());
  const renderingPagesRef = useRef<Set<number>>(new Set());

  // Helper giải phóng bộ nhớ tất cả blob URL đã cache
  const clearBlobCache = () => {
    blobCacheRef.current.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
    blobCacheRef.current.clear();

    // Reset các backgroundUrl dạng blob trong store để tránh lưu URL đã revoke khi remount
    const state = useFormBuilderStore.getState();
    const hasBlobPages = state.pages.some((p) => p.backgroundUrl?.startsWith("blob:"));
    if (hasBlobPages) {
      const cleanedPages = state.pages.map((p) =>
        p.backgroundUrl?.startsWith("blob:") ? { ...p, backgroundUrl: undefined } : p,
      );
      useFormBuilderStore.setState({ pages: cleanedPages });
    }
  };

  // Hàm render 1 trang PDF cụ thể cho 1 pageId
  const renderPageForId = useCallback(
    async (pageId: string, pageNum: number) => {
      if (!pdfDocRef.current || !pageNum || !pageId) return;

      // Đọc trạng thái mới nhất từ Store để tránh render đè
      const currentPages = useFormBuilderStore.getState().pages;
      const targetPage = currentPages.find((p) => p.id === pageId);
      if (targetPage?.backgroundUrl) return;

      // Kiểm tra cache blob đã có chưa
      const cachedBlobUrl = blobCacheRef.current.get(pageNum);
      if (cachedBlobUrl) {
        setTransientPageBackground(pageId, cachedBlobUrl);
        return;
      }

      // Tránh duplicate render cho cùng 1 pageNum
      if (renderingPagesRef.current.has(pageNum)) return;
      renderingPagesRef.current.add(pageNum);

      try {
        const blobUrl = await renderPdfPageToBlobUrl(pdfDocRef.current, pageNum);
        blobCacheRef.current.set(pageNum, blobUrl);
        setTransientPageBackground(pageId, blobUrl);
      } catch (err) {
        console.error(`[usePdfBackgroundRenderer] Lỗi render trang PDF ${pageNum}:`, err);
      } finally {
        renderingPagesRef.current.delete(pageNum);
      }
    },
    [setTransientPageBackground],
  );

  // Quản lý tải PDF Document khi fileKey thay đổi
  useEffect(() => {
    const fileUrl = backgroundPdf?.fileUrl;
    const fileKey = backgroundPdf?.fileKey;

    if (!fileKey || !fileUrl) {
      clearBlobCache();
      pdfDocRef.current = null;
      loadingDocKeyRef.current = null;
      return;
    }

    // Nếu document này đã tải xong trước đó, kiểm tra xem activePage cần render không
    if (loadingDocKeyRef.current === fileKey && pdfDocRef.current) {
      const state = useFormBuilderStore.getState();
      const currentActive = state.pages.find((p) => p.id === state.activePageId);
      if (currentActive?.pdfPageNumber && !currentActive.backgroundUrl) {
        renderPageForId(currentActive.id, currentActive.pdfPageNumber);
      }
      return;
    }

    if (loadingDocKeyRef.current === fileKey) {
      return;
    }

    loadingDocKeyRef.current = fileKey;

    // Làm mới cache nội bộ cho tài liệu mới
    blobCacheRef.current.clear();

    loadPdfDocument(fileUrl)
      .then(async (pdf) => {
        // Chỉ bỏ qua nếu fileKey đã bị đổi sang file khác trong lúc chờ
        if (loadingDocKeyRef.current !== fileKey) {
          return;
        }

        pdfDocRef.current = pdf;

        // 1. Render ưu tiên ngay cho activePage để người dùng thấy giao diện tức thì
        const state = useFormBuilderStore.getState();
        const currentActive = state.pages.find((p) => p.id === state.activePageId);
        if (currentActive?.pdfPageNumber && !currentActive.backgroundUrl) {
          await renderPageForId(currentActive.id, currentActive.pdfPageNumber);
        }

        // 2. Chỉ preload trang kế cận (+ - 1 trang)
        const activeIndex = state.pages.findIndex((p) => p.id === state.activePageId);
        const adjacentPages = [
          state.pages[activeIndex + 1],
          state.pages[activeIndex - 1],
        ].filter(Boolean);

        for (const page of adjacentPages) {
          if (page && page.pdfPageNumber && !page.backgroundUrl) {
            renderPageForId(page.id, page.pdfPageNumber).catch(() => {});
          }
        }
      })
      .catch((err) => {
        console.error('[usePdfBackgroundRenderer] Không thể nạp file PDF nền:', err);
        if (loadingDocKeyRef.current === fileKey) {
          loadingDocKeyRef.current = null;
        }
      });
  }, [backgroundPdf?.fileKey, backgroundPdf?.fileUrl, renderPageForId]);

  // Kích hoạt render mỗi khi chuyển activePage hoặc activePdfPageNum thay đổi
  useEffect(() => {
    if (pdfDocRef.current && activePdfPageNum && !hasBgUrl && activePageId) {
      renderPageForId(activePageId, activePdfPageNum);
    }

    // Preload thêm trang kế tiếp để chuẩn bị sẵn sàng khi người dùng chuyển trang
    if (pdfDocRef.current && activePageId) {
      const state = useFormBuilderStore.getState();
      const activeIdx = state.pages.findIndex((p) => p.id === activePageId);
      const nextPage = state.pages[activeIdx + 1];
      if (nextPage?.pdfPageNumber && !nextPage.backgroundUrl) {
        renderPageForId(nextPage.id, nextPage.pdfPageNumber).catch(() => {});
      }
    }
  }, [activePageId, activePdfPageNum, hasBgUrl, renderPageForId]);

  // Dọn dẹp tất cả blob URL khi hook unmount
  useEffect(() => {
    return () => {
      clearBlobCache();
    };
  }, []);
}
