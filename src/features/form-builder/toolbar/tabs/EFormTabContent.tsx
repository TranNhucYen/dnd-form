"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Inbox, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CollectFormModal } from "@/features/eform";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function EFormTabContent() {
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("formId");
  const parsedFormId = formIdParam ? Number(formIdParam) : null;
  const activeFormId =
    parsedFormId && !Number.isNaN(parsedFormId) ? parsedFormId : null;

  const [collectModalOpen, setCollectModalOpen] = useState(false);

  const pages = useFormBuilderStore((state) => state.pages);
  const totalFields = pages.reduce((acc, p) => acc + p.fields.length, 0);

  const getCurrentFormTitle = () =>
    document
      .querySelector<HTMLInputElement>("[data-form-title-input]")
      ?.value.trim() || "Biểu mẫu chưa đặt tên";

  const handlePreviewEForm = () => {
    const store = useFormBuilderStore.getState();
    const schema = store.getFormSchema();
    const previewId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `prev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payload = {
      // Lấy tên biểu mẫu hiện tại từ ô tiêu đề của trình thiết kế
      title: getCurrentFormTitle(),
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

  const handleOpenCollect = () => {
    if (!activeFormId) {
      toast.info("Vui lòng lưu biểu mẫu trước khi bật thu thập phản hồi.");
      return;
    }
    setCollectModalOpen(true);
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

      {/* Nút quản lý thu thập phản hồi qua E-Form */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenCollect}
        className="text-xs hover:bg-neutral-100 cursor-pointer border border-neutral-200/80 shadow-2xs"
        title="Lấy liên kết thu thập công khai và xem các bản đã điền"
      >
        <Inbox className="size-3.5 text-primary" />
        <span>Thu thập phản hồi</span>
      </Button>

      {/* Thông tin tóm tắt số trang & trường */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground select-none">
        <Sparkles className="size-3 text-amber-500" />
        <span>
          Tự động sinh web form ({pages.length} trang, {totalFields} trường)
        </span>
      </div>

      <CollectFormModal
        formId={activeFormId}
        formName={
          typeof document !== "undefined" ? getCurrentFormTitle() : undefined
        }
        open={collectModalOpen}
        onOpenChange={setCollectModalOpen}
      />
    </div>
  );
}
