'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { AdminTemplate } from '../types/template.type'

export interface ApproveModalProps {
  template: AdminTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => Promise<unknown> | void
}

export function ApproveModal({ template, open, onOpenChange, onConfirm }: ApproveModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!template) return null

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm(template.id)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col gap-1 text-left">
          <DialogTitle className="text-base font-bold text-foreground">
            Xác nhận duyệt biểu mẫu
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Bạn có chắc chắn muốn chấp nhận biểu mẫu{' '}
            <strong className="font-semibold text-foreground">
              "{template.title}"
            </strong>{' '}
            không? Biểu mẫu này sẽ được xuất bản công khai lên thư viện dùng chung.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="cursor-pointer text-xs"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="cursor-pointer text-xs gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Chấp nhận'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
