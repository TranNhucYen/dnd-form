'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __DRAGFORM_RENDER_READY__?: boolean;
  }
}

interface UsePrintReadinessOptions {
  expectedTipTapCount: number;
}

/**
 * Hook đồng bộ trạng thái sẵn sàng của trang in (font, ảnh, TipTap) cho puppeteer
 */
export function usePrintReadiness({ expectedTipTapCount }: UsePrintReadinessOptions) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function checkReadiness() {
      // Chờ font sẵn sàng
      if (typeof document !== 'undefined' && 'fonts' in document) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);
        } catch {
          // Bỏ qua lỗi font
        }
      }

      if (isCancelled) return;

      // Chờ tải và giải mã ảnh 
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(
        images.map(async (img) => {
          if (!img.src || (img.complete && img.naturalWidth !== 0)) return;
          try {
            await Promise.race([
              img.decode(),
              new Promise((resolve) => setTimeout(resolve, 2000)),
            ]);
          } catch {
          }
        })
      );
      
      if (isCancelled) return;

      // Chờ TipTap editor mount DOM 
      if (expectedTipTapCount > 0) {
        let attempts = 0;
        const maxAttempts = 20; 
        while (attempts < maxAttempts) {
          const mountedEditors = document.querySelectorAll(
            '.tiptap, .ProseMirror, [contenteditable]'
          );
          if (mountedEditors.length >= expectedTipTapCount) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (isCancelled) return;
          attempts++;
        }
      }

      // Chờ trình duyệt render & paint layout
      await new Promise<void>((resolve) => {
        let done = false;
        const timer = setTimeout(() => {
          if (!done) {
            done = true;
            resolve();
          }
        }, 500);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!done) {
              done = true;
              clearTimeout(timer);
              resolve();
            }
          });
        });
      });

      if (isCancelled) return;

      // Đánh dấu sẵn sàng cho Puppeteer
      window.__DRAGFORM_RENDER_READY__ = true;
      document.documentElement.dataset.renderReady = 'true';
      setIsReady(true);
    }

    checkReadiness();

    return () => {
      isCancelled = true;
    };
  }, [expectedTipTapCount]);

  return isReady;
}
