"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import { EFormPreviewContainer } from "@/features/eform";
import { FileQuestion, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewDataPayload {
  schema: FormSchemaJson;
  title?: string;
  timestamp: number;
}

function EFormPreviewContent() {
  const searchParams = useSearchParams();
  const previewId = searchParams.get("id");

  const [state, setState] = useState<{
    isLoading: boolean;
    previewData: PreviewDataPayload | null;
  }>({
    isLoading: true,
    previewData: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dọn dẹp các key preview đã lưu quá 12 giờ
    try {
      const now = Date.now();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("eform_preview_")) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              if (parsed.timestamp && now - parsed.timestamp > 12 * 60 * 60 * 1000) {
                localStorage.removeItem(key);
              }
            } catch {
              // Bỏ qua nếu parse lỗi
            }
          }
        }
      }
    } catch {
      // Bỏ qua lỗi truy cập localStorage
    }

    const timer = setTimeout(() => {
      if (!previewId) {
        setState({ isLoading: false, previewData: null });
        return;
      }

      try {
        const raw = localStorage.getItem(`eform_preview_${previewId}`);
        if (raw) {
          const parsed = JSON.parse(raw) as PreviewDataPayload;
          if (parsed && parsed.schema) {
            setState({ isLoading: false, previewData: parsed });
            return;
          }
        }
      } catch (err) {
        console.warn("[EFormPreview] Không thể đọc dữ liệu xem trước:", err);
      }

      setState({ isLoading: false, previewData: null });
    }, 0);

    return () => clearTimeout(timer);
  }, [previewId]);

  const { isLoading, previewData } = state;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-100">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs text-neutral-500">Đang tải biểu mẫu E-Form...</span>
        </div>
      </div>
    );
  }

  if (!previewData || !previewData.schema) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4">
        <div className="flex max-w-md flex-col items-center rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3">
            <FileQuestion className="size-6" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">
            Không tìm thấy dữ liệu xem trước
          </h2>
          <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
            Dữ liệu xem trước có thể đã hết hạn hoặc phiên xem trước không còn tồn tại.
            Vui lòng quay lại tab Trình thiết kế và nhấn nút <strong>&quot;Xem trước E-Form&quot;</strong> lần nữa.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.close()}
            className="mt-6 gap-2 text-xs cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Đóng tab này</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <EFormPreviewContainer
      schema={previewData.schema}
      title={previewData.title || "Biểu mẫu điện tử (E-Form)"}
    />
  );
}

export default function EFormPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-neutral-100">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <EFormPreviewContent />
    </Suspense>
  );
}
