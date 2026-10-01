"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";
import { getFormDetailAction } from "../actions/editor.action";
import { useEditorSave } from "./useEditorSave";

/**
 * Hook quản lý toàn bộ vòng đời khởi tạo, phân quyền và lưu trữ của EditorWorkspace
 */
export function useEditorWorkspace() {
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("formId");

  const [permission, setPermission] = useState<"owner" | "edit" | "view">("owner");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(formIdParam));
  const isReadOnly = permission === "view";

  const loadFormSchema = useFormBuilderStore((state) => state.loadFormSchema);
  const resetForm = useFormBuilderStore((state) => state.resetForm);
  const setIsReadOnly = useFormBuilderStore((state) => state.setIsReadOnly);

  const { formId, setFormId, titleInputRef } = useEditorSave(null, isReadOnly);

  useEffect(() => {
    setIsReadOnly(isReadOnly);
    return () => {
      setIsReadOnly(false);
    };
  }, [isReadOnly, setIsReadOnly]);

  useEffect(() => {
    // Tạo form mới: làm sạch canvas và đặt tiêu đề mặc định
    if (!formIdParam) {
      setPermission("owner");
      setAccessError(null);
      setIsLoading(false);
      setFormId(null);
      if (titleInputRef.current) {
        titleInputRef.current.value = "Biểu mẫu chưa đặt tên";
      }
      resetForm();
      return;
    }

    const parsedId = Number.parseInt(formIdParam, 10);
    if (!Number.isFinite(parsedId) || parsedId === formId) {
      setIsLoading(false);
      return;
    }

    // Tải dữ liệu biểu mẫu cũ nếu có formId trên URL
    let isMounted = true;
    setIsLoading(true);
    getFormDetailAction(parsedId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setAccessError(null);
          setPermission(res.data.currentUserPermission ?? "owner");
          setFormId(res.data.id);
          if (titleInputRef.current) {
            titleInputRef.current.value = res.data.name;
          }
          loadFormSchema(res.data.schemaContent);
        } else if (!res.success) {
          setAccessError(
            res.error || "Không thể tải dữ liệu biểu mẫu hoặc bạn không có quyền truy cập."
          );
          toast.error(res.error || "Không thể tải dữ liệu biểu mẫu");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [formIdParam, formId, loadFormSchema, resetForm, setFormId, titleInputRef]);

  return {
    formId,
    permission,
    isReadOnly,
    isLoading,
    accessError,
    titleInputRef,
  };
}
