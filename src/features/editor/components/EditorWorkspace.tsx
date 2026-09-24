"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FormBuilderWorkspace } from "@/features/form-builder/FormBuilderWorkspace";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";
import { getFormDetailAction } from "../actions/editor.action";
import { useEditorSave } from "../hooks/useEditorSave";
import { FormTitleInput } from "./FormTitleInput";

/** Workspace nạp form cũ hoặc tạo mới */
export function EditorWorkspace() {
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("formId");

  const loadFormSchema = useFormBuilderStore((state) => state.loadFormSchema);
  const resetForm = useFormBuilderStore((state) => state.resetForm);

  const { formId, setFormId, titleInputRef } = useEditorSave();

  useEffect(() => {
    // Tạo form mới: làm sạch canvas và đặt tiêu đề mặc định
    if (!formIdParam) {
      setFormId(null);
      if (titleInputRef.current) {
        titleInputRef.current.value = "Biểu mẫu chưa đặt tên";
      }
      resetForm();
      return;
    }

    const parsedId = Number.parseInt(formIdParam, 10);
    if (!Number.isFinite(parsedId) || parsedId === formId) return;

    // Tải dữ liệu biểu mẫu cũ nếu có formId trên URL
    let isMounted = true;
    getFormDetailAction(parsedId).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setFormId(res.data.id);
        if (titleInputRef.current) {
          titleInputRef.current.value = res.data.name;
        }
        loadFormSchema(res.data.schemaContent);
      } else if (!res.success) {
        toast.error(res.error || "Không thể tải dữ liệu biểu mẫu");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [formIdParam, formId, loadFormSchema, resetForm, setFormId, titleInputRef]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <FormTitleInput inputRef={titleInputRef} />
      </div>
      <FormBuilderWorkspace />
    </div>
  );
}
