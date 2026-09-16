'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { AdminUser, UserStatus } from '../types/user.type'

interface ChangeStatusModalProps {
  user: AdminUser | null
  newStatus: UserStatus | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (userId: number, status: UserStatus) => Promise<unknown> | void
}

export function ChangeStatusModal({
  user,
  newStatus,
  open,
  onOpenChange,
  onConfirm,
}: ChangeStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user || !newStatus) return null

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onConfirm(user.id, newStatus)
      onOpenChange(false)
    } catch {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader className="flex flex-col gap-2 text-left">
          <AlertDialogTitle className="text-base font-semibold">
            Xác nhận thay đổi trạng thái
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            Bạn có chắc muốn đổi trạng thái từ{' '}
            <strong className="font-semibold text-foreground">
              {user.status}
            </strong>{' '}
            sang{' '}
            <strong className="font-semibold text-foreground">
              {newStatus}
            </strong>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isSubmitting}
            className="cursor-pointer text-xs"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="cursor-pointer text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
