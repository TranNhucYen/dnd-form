'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { AdminTemplate } from '../types/template.type'

export interface RejectModalProps {
  template: AdminTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number, reason: string) => Promise<unknown> | void
}

export function RejectModal({ template, open, onOpenChange, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (template && open) {
      setReason(template.rejectReason || '')
      setErrorMessage(null)
    }
  }, [template, open])

  if (!template) return null

  const handleClose = () => {
    onOpenChange(false)
    setReason('')
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setErrorMessage('Vui lòng nhập lý do từ chối.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onConfirm(template.id, reason.trim())
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-1 text-left">
            <DialogTitle className="text-base font-bold text-foreground">
              Lý do từ chối biểu mẫu
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Vui lòng nhập lý do từ chối để phản hồi cho người tạo biểu mẫu{' '}
              <strong className="font-semibold text-foreground">
                "{template.title}"
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="p-2.5 text-xs rounded-md bg-destructive/10 text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5 py-1">
            <Label
              htmlFor="template-reject-reason"
              className="text-xs font-semibold text-foreground"
            >
              Lý do từ chối <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="template-reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do chi tiết từ chối duyệt biểu mẫu này..."
              className="
                text-xs h-36 resize-none overflow-y-auto
                field-sizing-fixed leading-relaxed"
              required
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer text-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận từ chối'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export interface RejectDetailModalProps {
  template: AdminTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RejectDetailModal({ template, open, onOpenChange }: RejectDetailModalProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-bold text-foreground">
            Lý do từ chối
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 text-xs text-foreground leading-relaxed whitespace-pre-wrap select-text max-h-60 overflow-y-auto">
          {template.rejectReason || ''}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-xs"
          >
            Thoát
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
