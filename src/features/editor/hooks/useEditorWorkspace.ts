"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";
import { ROUTES } from "@/shared/constants/routes";
import { getFormDetailAction } from "../actions/editor.action";
import { useEditorSave } from "./useEditorSave";
import { useEditorDraft } from "./useEditorDraft";

/**
 * Hook điều phối Editor: quản lý phân quyền, tải form và kết nối Lưu / Nháp.
 */
export function useEditorWorkspace() {
  const router = useRouter();
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

  // Tên biểu mẫu thật sự đã lưu trên cơ sở dữ liệu
  const [savedTitle, setSavedTitle] = useState<string>("Biểu mẫu chưa đặt tên");

  const isReadOnly = permission === "view";

  const resetForm = useFormBuilderStore((state) => state.resetForm);
  const setIsReadOnly = useFormBuilderStore((state) => state.setIsReadOnly);
  const setOnNewForm = useFormBuilderStore((state) => state.setOnNewForm);

  // Hook quản lý lưu biểu mẫu
  const { formId, setFormId, title, setTitle, titleInputRef } = useEditorSave(
    null,
    isReadOnly,
    {
      onSaveSuccess: (savedSnapshot, _newFormId, newSavedTitle) => {
        handleSaveSuccess(savedSnapshot);
        setSavedTitle(newSavedTitle);
      },
    },
  );

  // Hook chuyên trách quản lý bản nháp (Draft), dirty check và auto-save
  const {
    initNewFormDraft,
    handleServerFormLoaded,
    handleSaveSuccess,
    clearDraft,
  } = useEditorDraft({
    formId,
    title,
    isReadOnly,
    isLoading,
    setTitle,
    titleInputRef,
  });

  // Đồng bộ state khi formIdParam trên URL thay đổi (mô hình React official: adjusting state during render)
  if (formIdParam !== prevFormIdParam) {
    setPrevFormIdParam(formIdParam);
    if (!formIdParam) {
      setPermission("owner");
      setAccessError(null);
      setIsLoading(false);
      setFormId(null);
      setTitle("Biểu mẫu chưa đặt tên");
      setSavedTitle("Biểu mẫu chưa đặt tên");
    } else {
      const parsed = Number.parseInt(formIdParam, 10);
      if (!Number.isFinite(parsed)) {
        setIsLoading(false);
        setAccessError("Mã biểu mẫu trên đường dẫn không hợp lệ.");
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

  // Quản lý việc nạp dữ liệu khi formIdParam thay đổi
  useEffect(() => {
    let isCurrent = true;

    // Tạo form mới (/editor)
    if (!formIdParam) {
      initNewFormDraft();
      return;
    }

    // Chỉnh sửa form có sẵn (/editor?formId=...)
    const parsedId = Number.parseInt(formIdParam, 10);
    if (!Number.isFinite(parsedId)) {
      return;
    }

    getFormDetailAction(parsedId)
      .then((res) => {
        if (!isCurrent) return;

        if (res.success && res.data) {
          setAccessError(null);
          const currentPerm = res.data.currentUserPermission ?? "owner";
          setPermission(currentPerm);
          setFormId(res.data.id);
          setSavedTitle(res.data.name);

          // Chuyển toàn bộ việc xử lý nạp schema và nháp sang useEditorDraft
          handleServerFormLoaded(res.data);
        } else {
          setAccessError(
            res.error || "Không thể tải dữ liệu biểu mẫu hoặc bạn không có quyền truy cập.",
          );
          toast.error(res.error || "Không thể tải dữ liệu biểu mẫu");
        }
      })
      .catch((err) => {
        if (!isCurrent) return;
        console.error("Lỗi khi tải chi tiết biểu mẫu:", err);
        setAccessError("Đã xảy ra lỗi khi tải biểu mẫu. Vui lòng thử lại.");
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [formIdParam, initNewFormDraft, handleServerFormLoaded, setFormId]);

  // Tạo biểu mẫu mới (dọn dẹp canvas & nháp)
  const handleNewForm = useCallback(() => {
    clearDraft(null);
    if (formId) {
      clearDraft(formId);
    }

    resetForm();
    setTitle("Biểu mẫu chưa đặt tên");
    setSavedTitle("Biểu mẫu chưa đặt tên");
    if (titleInputRef.current) {
      titleInputRef.current.value = "Biểu mẫu chưa đặt tên";
    }

    initNewFormDraft();

    if (formIdParam) {
      router.push(ROUTES.EDITOR);
    }
    toast.success("Đã tạo biểu mẫu mới");
  }, [clearDraft, formId, formIdParam, initNewFormDraft, resetForm, router, setTitle, titleInputRef]);

  // Đăng ký hành động tạo form mới vào store để NewFormTool trên Toolbar có thể gọi
  useEffect(() => {
    setOnNewForm(handleNewForm);
    return () => {
      setOnNewForm(undefined);
    };
  }, [setOnNewForm, handleNewForm]);

  return {
    formId,
    title,
    setTitle,
    savedTitle,
    permission,
    isReadOnly,
    isLoading,
    accessError,
    titleInputRef,
    handleNewForm,
  };
}
