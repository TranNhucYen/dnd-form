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

export interface DescriptionModalProps {
  template: AdminTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number, description: string) => Promise<unknown> | void
}

export function DescriptionModal({ template, open, onOpenChange, onSave }: DescriptionModalProps) {
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (template) {
      setDescription(template.description || '')
    }
  }, [template])

  if (!template) return null

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(template.id, description.trim())
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-1 text-left">
            <DialogTitle className="text-base font-bold text-foreground">
              Mô tả biểu mẫu
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Xem và chỉnh sửa mô tả chi tiết cho biểu mẫu{' '}
              <strong className="font-semibold text-foreground">
                "{template.title}"
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5 py-1">
            <Label
              htmlFor="template-description"
              className="text-xs font-semibold text-foreground"
            >
              Nội dung mô tả
            </Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết về biểu mẫu mẫu..."
              className="
                text-xs h-52 resize-none overflow-y-auto
                field-sizing-fixed leading-relaxed"
              disabled={isSubmitting}
            />
          </div>

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
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer text-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
