"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, FileX, Loader2, Sliders, Trash2 } from "lucide-react";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { extractPdfPagesToBlobUrls } from "@/lib/pdf-client/pdf-extractor";
import { uploadDocumentAction } from "@/features/editor";
import { toast } from "sonner";

export function PdfBackgroundTool() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pages = useFormBuilderStore((state) => state.pages);
  const activePageId = useFormBuilderStore((state) => state.activePageId);
  const backgroundPdf = useFormBuilderStore((state) => state.backgroundPdf);
  const activePage = pages.find((p) => p.id === activePageId);

  const setBackgroundPdf = useFormBuilderStore((state) => state.setBackgroundPdf);
  const setMultiPageBackgrounds = useFormBuilderStore(
    (state) => state.setMultiPageBackgrounds,
  );
  const setBackgroundOpacity = useFormBuilderStore(
    (state) => state.setBackgroundOpacity,
  );
  const clearPageBackground = useFormBuilderStore(
    (state) => state.clearPageBackground,
  );
  const clearBackgroundPdf = useFormBuilderStore(
    (state) => state.clearBackgroundPdf,
  );

  const currentOpacity = backgroundPdf?.opacity ?? 1;
  const hasPageBg = Boolean(activePage?.backgroundUrl);
  const hasAnyPdfBg = Boolean(backgroundPdf?.fileKey || pages.some((p) => p.backgroundUrl));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file: chỉ chấp nhận PDF
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Định dạng tài liệu không hợp lệ. Vui lòng chọn file PDF (.pdf)");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Kiểm tra kích thước file, tối đa 20MB
    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Kích thước tài liệu vượt quá giới hạn 20MB. Vui lòng chọn file nhỏ hơn.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading("Đang xử lý và tải lên tài liệu PDF...", { id: "pdf-upload" });

      // Tải lên Storage ở Server (lưu 1 file gốc)
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadDocumentAction(formData);

      if (!uploadRes.success || !uploadRes.data) {
        throw new Error(uploadRes.error || "Tải tài liệu lên máy chủ thất bại.");
      }

      const uploadedDoc = uploadRes.data;

      //Trích xuất Blob URLs hiển thị tức thời cho người dùng (Optimistic UI)
      const blobUrls = await extractPdfPagesToBlobUrls(file);

      if (blobUrls.length === 0) {
        throw new Error("Không thể trích xuất trang nào từ tài liệu.");
      }

      // Tạo map { pageIndex: pdfPageNumber } (1-based)
      const pagePdfMap: Record<number, number> = {};
      blobUrls.forEach((_, idx) => {
        pagePdfMap[idx] = idx + 1;
      });

      // Cập nhật Store: backgroundPdf metadata và multi-page backgrounds
      setBackgroundPdf({
        fileKey: uploadedDoc.key,
        fileUrl: uploadedDoc.url,
        fileName: file.name,
        fileSize: file.size,
        totalPages: blobUrls.length,
      });

      setMultiPageBackgrounds(blobUrls, pagePdfMap);

      toast.success(
        `Đã tải lên và gán nền PDF (${blobUrls.length} trang) thành công!`,
        { id: "pdf-upload" },
      );
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Tải file PDF thất bại.";
      toast.error(message, { id: "pdf-upload" });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearCurrentPage = () => {
    clearPageBackground(activePageId);
    const remainingBgPages = pages.filter(
      (p) => p.id !== activePageId && Boolean(p.backgroundUrl),
    );
    if (remainingBgPages.length === 0) {
      clearBackgroundPdf();
    }
    toast.info("Đã xóa nền của trang hiện tại");
  };

  const handleClearAllBackgrounds = () => {
    clearBackgroundPdf();
    toast.info("Đã xóa toàn bộ PDF nền của tài liệu");
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Input ẩn để chọn file PDF */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Nút tải lên PDF nền */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isProcessing}
        onClick={() => fileInputRef.current?.click()}
        className="h-7 gap-1.5 px-2.5 text-xs cursor-pointer font-medium"
        title="Tải lên PDF để làm nền cho các trang Canvas"
      >
        {isProcessing ? (
          <Loader2 className="size-3.5 animate-spin text-primary" />
        ) : (
          <FileUp className="size-3.5 text-primary" />
        )}
        <span>{isProcessing ? "Đang xử lý PDF..." : "Tải lên PDF nền"}</span>
      </Button>

      {/* Thanh làm mờ PDF background (áp dụng cho toàn bộ các trang) */}
      <div
        className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 border border-border/70 bg-neutral-50/80 transition-opacity ${
          hasAnyPdfBg ? "opacity-100" : "opacity-45 pointer-events-none"
        }`}
        title={hasAnyPdfBg ? "Thanh chỉnh độ mờ PDF nền (áp dụng cho tất cả các trang)" : "Cần có PDF nền để chỉnh độ mờ"}
      >
        <Sliders className="size-3 text-muted-foreground shrink-0" />
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          disabled={!hasAnyPdfBg}
          value={hasAnyPdfBg ? currentOpacity : 1}
          onChange={(e) =>
            setBackgroundOpacity(Number.parseFloat(e.target.value))
          }
          className="h-1.5 w-16 sm:w-20 cursor-pointer accent-primary"
        />
        <span className="text-[11px] font-mono text-muted-foreground w-7 text-right select-none">
          {hasAnyPdfBg ? `${Math.round(currentOpacity * 100)}%` : "100%"}
        </span>
      </div>

      {/* Xóa trang hiện tại */}
      {hasPageBg && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearCurrentPage}
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
          title="Xóa nền của trang hiện tại đang chọn"
        >
          <Trash2 className="size-3.5" />
          <span>Xóa trang hiện tại</span>
        </Button>
      )}

      {/* Xóa toàn bộ PDF nền */}
      {hasAnyPdfBg && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAllBackgrounds}
          className="h-7 gap-1.5 px-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
          title="Xóa toàn bộ PDF nền của tất cả các trang"
        >
          <FileX className="size-3.5" />
          <span>Xóa toàn bộ PDF nền</span>
        </Button>
      )}
    </div>
  );
}
