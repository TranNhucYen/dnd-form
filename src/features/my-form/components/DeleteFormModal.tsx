'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { MyForm } from '../types/my-form.type'

interface DeleteFormModalProps {
  form: MyForm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: (id: number) => Promise<unknown>
}

export function DeleteFormModal({
  form,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteFormModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!form) return null

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await onConfirmDelete(form.id)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Xác nhận xóa biểu mẫu?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa biểu mẫu{' '}
            <strong className="text-foreground font-semibold">"{form.title}"</strong>? Mọi dữ liệu cấu
            trúc trường và phản hồi liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="cursor-pointer text-xs">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer text-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xác nhận xóa'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


