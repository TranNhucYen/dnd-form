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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { AdminTemplate } from '../types/template.type'

export interface GuidelineModalProps {
  template: AdminTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number, guidelines: string[]) => Promise<unknown> | void
}

export function GuidelineModal({ template, open, onOpenChange, onSave }: GuidelineModalProps) {
  const [guidelines, setGuidelines] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (template) {
      setGuidelines(
        template.guidelines && template.guidelines.length > 0
          ? [...template.guidelines]
          : ['']
      )
    }
  }, [template])

  if (!template) return null

  const handleAddStep = () => {
    setGuidelines((prev) => [...prev, ''])
  }

  const handleUpdateStep = (index: number, value: string) => {
    setGuidelines((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleRemoveStep = (index: number) => {
    setGuidelines((prev) => {
      const next = prev.filter((_, i) => i !== index)
      return next.length > 0 ? next : ['']
    })
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const filtered = guidelines.map((g) => g.trim()).filter(Boolean)
      await onSave(template.id, filtered)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-1 text-left">
            <DialogTitle className="text-base font-bold text-foreground">
              Hướng dẫn điền biểu mẫu
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Thiết lập các bước chỉ dẫn để người dùng điền đúng dữ liệu cho{' '}
              <strong className="font-semibold text-foreground">
                "{template.title}"
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-foreground">
              Danh sách các bước hướng dẫn
            </Label>

            <div className="h-72 overflow-y-auto pr-1 flex flex-col gap-2.5">
              {guidelines.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="
                      size-6 rounded-full bg-muted text-muted-foreground
                      flex items-center justify-center text-xs font-semibold shrink-0"
                  >
                    {index + 1}
                  </span>
                  <Input
                    value={step}
                    onChange={(e) => handleUpdateStep(index, e.target.value)}
                    placeholder={`Nhập hướng dẫn bước ${index + 1}...`}
                    className="text-xs h-9 flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStep(index)}
                    disabled={isSubmitting || (guidelines.length === 1 && !step)}
                    className="size-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                    title="Xóa bước này"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Nút thêm bước hướng dẫn */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              disabled={isSubmitting}
              className="text-xs h-8 gap-1.5 self-start mt-1 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Thêm bước
            </Button>
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
                'Lưu hướng dẫn'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
