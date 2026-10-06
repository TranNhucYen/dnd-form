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

  const parsedInitialId = formIdParam ? Number.parseInt(formIdParam, 10) : null;
  const isInitialInvalid = Boolean(formIdParam && !Number.isFinite(parsedInitialId));

  const [permission, setPermission] = useState<"owner" | "edit" | "view">("owner");
  const [accessError, setAccessError] = useState<string | null>(() =>
    isInitialInvalid ? "Mã biểu mẫu trên đường dẫn không hợp lệ." : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    Boolean(formIdParam && Number.isFinite(parsedInitialId))
  );
  const [prevFormIdParam, setPrevFormIdParam] = useState(formIdParam);

  const isReadOnly = permission === "view";

  const loadFormSchema = useFormBuilderStore((state) => state.loadFormSchema);
  const resetForm = useFormBuilderStore((state) => state.resetForm);
  const setIsReadOnly = useFormBuilderStore((state) => state.setIsReadOnly);

  const { formId, setFormId, title, setTitle, titleInputRef } = useEditorSave(null, isReadOnly);

  // Điều chỉnh state khi formIdParam trên URL thay đổi 
  if (formIdParam !== prevFormIdParam) {
    setPrevFormIdParam(formIdParam);
    if (!formIdParam) {
      setPermission("owner");
      setAccessError(null);
      setIsLoading(false);
      setFormId(null);
      setTitle("Biểu mẫu chưa có tên");
    } else {
      const parsed = Number.parseInt(formIdParam, 10);
      if (!Number.isFinite(parsed)) {
        setIsLoading(false);
        setAccessError("Mã biểu mẫu trên đường dẫn không hợp lệ.");
      } else if (parsed === formId) {
        setIsLoading(false);
      } else {
        setAccessError(null);
        setIsLoading(true);
      }
    }
  }

  useEffect(() => {
    setIsReadOnly(isReadOnly);
    return () => {
      setIsReadOnly(false);
    };
  }, [isReadOnly, setIsReadOnly]);

  useEffect(() => {
    if (!formIdParam) {
      resetForm();
      return;
    }

    const parsedId = Number.parseInt(formIdParam, 10);
    if (!Number.isFinite(parsedId) || parsedId === formId) {
      return;
    }

    let isMounted = true;
    getFormDetailAction(parsedId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setAccessError(null);
          setPermission(res.data.currentUserPermission ?? "owner");
          setFormId(res.data.id);
          setTitle(res.data.name);
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
  }, [formIdParam, formId, loadFormSchema, resetForm, setFormId, setTitle, titleInputRef]);

  return {
    formId,
    title,
    setTitle,
    permission,
    isReadOnly,
    isLoading,
    accessError,
    titleInputRef,
  };
}
