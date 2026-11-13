"use client";

import { useTranslation } from 'react-i18next'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { FormBuilderWorkspace } from "@/features/form-builder/FormBuilderWorkspace";
import { useEditorWorkspace } from "../hooks/useEditorWorkspace";
import { FormTitleInput } from "./FormTitleInput";

/** Workspace nạp form cũ hoặc tạo mới */
export function EditorWorkspace() {
  const { t } = useTranslation()
  const router = useRouter();
  const {
    isLoading,
    accessError,
    isReadOnly,
    title,
    setTitle,
    savedTitle,
    titleInputRef,
    formId,
  } = useEditorWorkspace();

  // Đồng bộ tiêu đề tab trình duyệt theo tên biểu mẫu đang mở
  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('editor.documentTitle', { title });
    return () => {
      document.title = previousTitle;
    };
  }, [t, title]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('editor.generated.dangTaiBieuMau')}</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu không có quyền truy cập
  if (accessError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-10rem)]">
        <div className="max-w-md p-8 bg-card border border-border rounded-lg shadow-sm flex flex-col items-center gap-4">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <ShieldAlert className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('editor.generated.khongCoQuyenTruyCap')}</h2>
          <p className="text-sm text-muted-foreground">{accessError}</p>
          <Button
            onClick={() => router.push(ROUTES.MY_FORM)}
            className="mt-2 cursor-pointer"
          >
            {t('editor.generated.quayLaiBieuMauCuaToi')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Banner hiển thị khi ở chế độ chỉ xem */}
      {isReadOnly && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
          <Eye className="size-3.5 shrink-0" />
          <span>{t('editor.generated.cheDoChiXemBanKhongCoQuyenChinh')}</span>
        </div>
      )}

      <div className="flex items-center">
        <FormTitleInput
          key={formId ?? "new"}
          inputRef={titleInputRef}
          defaultValue={title}
          savedTitle={savedTitle}
          disabled={isReadOnly}
          onTitleChange={setTitle}
        />
      </div>

      <FormBuilderWorkspace />
    </div>
  );
}
