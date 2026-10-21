"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function EFormTabContent() {
  const pages = useFormBuilderStore((state) => state.pages);
  const totalFields = pages.reduce((acc, p) => acc + p.fields.length, 0);

  const handlePreviewEForm = () => {
    const store = useFormBuilderStore.getState();
    const schema = store.getFormSchema();
    const previewId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `prev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payload = {
      // Lấy tên biểu mẫu hiện tại từ ô tiêu đề của trình thiết kế
      title:
        document
          .querySelector<HTMLInputElement>("[data-form-title-input]")
          ?.value.trim() || "Biểu mẫu chưa đặt tên",
      schema,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(
        `eform_preview_${previewId}`,
        JSON.stringify(payload),
      );
    } catch (err) {
      console.warn("[EForm] Không thể ghi dữ liệu xem trước vào localStorage:", err);
    }

    window.open(`/preview/eform?id=${previewId}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* Nút xem trước E-Form */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreviewEForm}
        className="h-7 gap-1.5 px-2.5 text-xs font-medium hover:bg-neutral-100 cursor-pointer text-foreground border border-neutral-200/80 shadow-2xs"
        title="Mở biểu mẫu điện tử trên tab trình duyệt mới"
      >
        <ExternalLink className="size-3.5 text-primary" />
        <span>Xem trước E-Form</span>
      </Button>

      {/* Thông tin tóm tắt số trang & trường */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground select-none">
        <Sparkles className="size-3 text-amber-500" />
        <span>
          Tự động sinh web form ({pages.length} trang, {totalFields} trường)
        </span>
      </div>
    </div>
  );
}
