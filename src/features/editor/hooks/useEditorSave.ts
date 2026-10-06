"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveFormAction } from "../actions/editor.action";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import { DYNAMIC_ROUTES } from "@/shared/constants/routes";

/** Hook quản lý lưu biểu mẫu và đồng bộ tiêu đề qua ref */
export function useEditorSave(
  initialFormId?: number | null,
  isReadOnly = false,
) {
  const [formId, setFormId] = useState<number | null>(initialFormId ?? null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const setOnSave = useFormBuilderStore((state) => state.setOnSave);

  const handleSave = useCallback(
    async (schema: FormSchemaJson) => {
      const toastId = toast.loading("Đang lưu biểu mẫu...");

      // Đọc tiêu đề trực tiếp từ input ref khi lưu
      const title = titleInputRef.current?.value.trim() || "Biểu mẫu chưa đặt tên";

      // Khôi phục tên mặc định trên giao diện nếu input để trống
      if (titleInputRef.current && !titleInputRef.current.value.trim()) {
        titleInputRef.current.value = title;
      }

      try {
        const res = await saveFormAction({ formId, title, schema, });

        if (!res.success || !res.data) {
          toast.error(res.error || "Lưu biểu mẫu thất bại", { id: toastId });
          return;
        }

        toast.success("Đã lưu biểu mẫu thành công", { id: toastId });

        // Cập nhật formId vào state và URL nếu là form mới tạo
        if (!formId && res.data.formId) {
          setFormId(res.data.formId);
          window.history.replaceState(null, "", `${DYNAMIC_ROUTES.FORM_EDIT(res.data.formId)}`,
          );
        }
      } catch (error) {
        console.error("Lỗi khi lưu biểu mẫu:", error);
        toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi khi lưu", { id: toastId });
      }
    },
    [formId],
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
    titleInputRef,
    handleSave,
  };
}
