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
import type { MyForm } from '../types/my-form.type'

interface DeleteFormModalProps {
  forms: MyForm[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: (id: number) => Promise<unknown>
}

export function DeleteFormModal({
  forms,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteFormModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (forms.length === 0) return null

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      let allDeleted = true
      for (const form of forms) {
        const result = await onConfirmDelete(form.id)
        if (result !== true) allDeleted = false
      }
      if (allDeleted) onOpenChange(false)
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
            {forms.length === 1 ? 'Xác nhận xóa biểu mẫu?' : `Xác nhận xóa ${forms.length} biểu mẫu?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {forms.length === 1 ? (
              <>Bạn có chắc chắn muốn xóa biểu mẫu <strong className="text-foreground font-semibold">&ldquo;{forms[0].name}&rdquo;</strong>?</>
            ) : (
              <>Bạn có chắc chắn muốn xóa {forms.length} biểu mẫu đã chọn?</>
            )}{' '}
            Mọi dữ liệu cấu trúc trường liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.
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
              forms.length === 1 ? 'Xác nhận xóa' : `Xóa ${forms.length} biểu mẫu`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
