"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveFormAction } from "../actions/editor.action";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import { DYNAMIC_ROUTES } from "@/shared/constants/routes";
import { clearFormDraft, createFormSnapshot } from "../utils/draft-storage";

export interface UseEditorSaveOptions {
  onSaveSuccess?: (savedSnapshot: string, newFormId: number, savedTitle: string) => void;
}

/** Hook quản lý lưu biểu mẫu và đồng bộ tiêu đề qua ref và state */
export function useEditorSave(
  initialFormId?: number | null,
  isReadOnly = false,
  options?: UseEditorSaveOptions,
) {
  const [formId, setFormId] = useState<number | null>(initialFormId ?? null);
  const [title, setTitle] = useState<string>("Biểu mẫu chưa đặt tên");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const setOnSave = useFormBuilderStore((state) => state.setOnSave);
  const setIsDirty = useFormBuilderStore((state) => state.setIsDirty);

  const onSaveSuccessRef = useRef(options?.onSaveSuccess);
  useEffect(() => {
    onSaveSuccessRef.current = options?.onSaveSuccess;
  }, [options?.onSaveSuccess]);

  const handleSave = useCallback(
    async (schema: FormSchemaJson) => {
      const toastId = toast.loading("Đang lưu biểu mẫu...");

      // Đọc tiêu đề trực tiếp từ input ref khi lưu, fallback về title state
      const rawTitle = titleInputRef.current?.value.trim() || title.trim();
      const finalTitle = rawTitle || "Biểu mẫu chưa đặt tên";

      // Khôi phục tên hiển thị trên giao diện nếu input để trống
      if (titleInputRef.current) {
        titleInputRef.current.value = finalTitle;
      }

      try {
        const res = await saveFormAction({ formId, title: finalTitle, schema });

        if (!res.success || !res.data) {
          toast.error(res.error || "Lưu biểu mẫu thất bại", { id: toastId });
          return;
        }

        toast.success("Đã lưu biểu mẫu thành công", { id: toastId });

        // Danh sách biểu mẫu/trang chủ đã thay đổi nên cần nạp lại ở lần mở kế tiếp
        void queryClient.invalidateQueries({ queryKey: ["my-form"] });
        void queryClient.invalidateQueries({ queryKey: ["home"] });

        // Đồng bộ tiêu đề chính thức trả về từ server
        const savedTitle = res.data.title || finalTitle;
        if (res.data.title) {
          setTitle(res.data.title);
        }

        const newFormId = res.data.formId ?? formId;

        // Xóa bản nháp trong localStorage
        clearFormDraft(formId);
        if (!formId) {
          clearFormDraft(null);
        }

        // Cập nhật snapshot mới và tắt cờ dirty
        const savedSnapshot = createFormSnapshot(savedTitle, schema);
        setIsDirty(false);
        onSaveSuccessRef.current?.(savedSnapshot, newFormId, savedTitle);

        // Cập nhật formId vào state và URL nếu là form mới tạo
        if (!formId && res.data.formId) {
          setFormId(res.data.formId);
          window.history.replaceState(null, "", `${DYNAMIC_ROUTES.FORM_EDIT(res.data.formId)}`);
        }
      } catch (error) {
        console.error("Lỗi khi lưu biểu mẫu:", error);
        toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi khi lưu", { id: toastId });
      }
    },
    [formId, title, setIsDirty, queryClient],
  );

  // Ref trampoline: giữ tham chiếu mới nhất, tránh vòng lặp re-render
  const handleSaveRef = useRef(handleSave);
  useEffect(() => {
    handleSaveRef.current = handleSave;
  });

  useEffect(() => {
    if (isReadOnly) {
      setOnSave(undefined);
      return;
    }

    setOnSave(async (schema) => {
      await handleSaveRef.current(schema);
    });

    return () => {
      setOnSave(undefined);
    };
  }, [setOnSave, isReadOnly]);

  return {
    formId,
    setFormId,
    title,
    setTitle,
    titleInputRef,
    handleSave,
  };
}
