"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

/**
 * Hook tải file PDF của bản ghi nộp biểu mẫu từ server qua Puppeteer.
 */
export function useExportSubmissionPdf() {
  const [isExporting, setIsExporting] = useState(false);

  const downloadSubmissionPdf = useCallback(
    async (submissionId: number | string, formName?: string) => {
      if (!submissionId) return;

      const toastId = toast.loading("Đang chuẩn bị file PDF bản nộp...");

      try {
        setIsExporting(true);

        const response = await fetch(`/api/submissions/${submissionId}/export-pdf`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Không thể xuất file PDF bản nộp");
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const safeName = slugify(formName) || "ban-nop";
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = `${safeName}-ban-nop-${submissionId}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);

        toast.success("Đã tải xuống file PDF thành công!", { id: toastId });
      } catch (err) {
        console.error("Lỗi khi xuất PDF bản nộp:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi tải xuống file PDF",
          { id: toastId }
        );
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const downloadSubmissionPdfsZip = useCallback(
    async (submissionIds: number[], formName?: string) => {
      if (submissionIds.length < 2) return;

      const toastId = toast.loading("Đang tạo PDF và đóng gói file ZIP...");

      try {
        setIsExporting(true);
        const response = await fetch("/api/submissions/export-pdf-zip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionIds }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Không thể xuất file ZIP PDF");
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = `${slugify(formName) || "ban-nop"}-pdf.zip`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);

        toast.success("Đã tải xuống file ZIP thành công!", { id: toastId });
      } catch (err) {
        console.error("Lỗi khi xuất ZIP PDF:", err);
        toast.error(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải file ZIP",
          { id: toastId },
        );
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  return {
    isExporting,
    downloadSubmissionPdf,
    downloadSubmissionPdfsZip,
  };
}
