"use client";

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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bản ghi phản hồi?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Bản ghi phản hồi này sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            onClick={() => {
              if (submissionId) {
                onConfirm(submissionId);
                onOpenChange(false);
              }
            }}
          >
            Xác nhận xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
