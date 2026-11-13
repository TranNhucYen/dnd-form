"use client";

import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface DeleteSubmissionDialogProps {
  /** ID của bản nộp cần xóa (null nếu không có bản nộp nào được chọn) */
  submissionId: number | null;
  /** Trạng thái mở modal */
  open: boolean;
  /** Callback khi trạng thái đóng/mở thay đổi */
  onOpenChange: (open: boolean) => void;
  /** Callback xác nhận xóa bản nộp */
  onConfirm: (submissionId: number) => void;
}

/**
 * Modal cảnh báo và xác nhận xóa vĩnh viễn một bản ghi phản hồi.
 */
export function DeleteSubmissionDialog({
  submissionId,
  open,
  onOpenChange,
  onConfirm,
}: DeleteSubmissionDialogProps) {
  const { t } = useTranslation()
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('eform.generated.xoaBanGhiPhanHoi')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('eform.generated.hanhDongNayKhongTheHoanTacBanGhi')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t('eform.generated.huy')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            onClick={() => {
              if (submissionId) {
                onConfirm(submissionId);
                onOpenChange(false);
              }
            }}
          >
            {t('eform.generated.xacNhanXoa')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
