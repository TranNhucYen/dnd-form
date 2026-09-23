'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Plus, LayoutTemplate, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { MyForm } from '../types/my-form.type'

interface CreateFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBlank: (data: { title: string; description?: string }) => Promise<MyForm>
}

type Step = 'choose_mode' | 'blank_form'

export function CreateFormModal({
  open,
  onOpenChange,
  onCreateBlank,
}: CreateFormModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('choose_mode')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep('choose_mode')
      setTitle('')
      setDescription('')
    }, 200)
  }

  const handleCreateBlankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const created = await onCreateBlank({
        title: title.trim(),
        description: description.trim() || undefined,
      })
      handleClose()
      router.push(`/editor?formId=${created.id}`)
    } catch (err) {
      console.error('Lỗi khi tạo biểu mẫu:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'choose_mode' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Tạo biểu mẫu mới
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Chọn phương thức bạn muốn bắt đầu để tạo biểu mẫu.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-3 py-4">
              {/* Option 1: Blank form */}
              <button
                type="button"
                onClick={() => setStep('blank_form')}
                className="flex items-start gap-4 p-4 text-left rounded-xl
                  border border-border hover:border-muted-foreground/40
                  hover:bg-muted/40 transition-all group cursor-pointer"
              >
                <div
                  className="size-10 rounded-lg bg-emerald-50 text-emerald-600
                  flex items-center justify-center shrink-0
                  group-hover:scale-105 transition-transform"
                >
                  <Plus className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className="font-semibold text-foreground text-sm
                      group-hover:text-emerald-700 transition-colors"
                    >
                      Tạo biểu mẫu từ đầu
                    </h4>
                    <ArrowRight
                      className="size-4 text-muted-foreground
                      group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bắt đầu với một trang biểu mẫu trắng và tự kéo thả các thành phần theo ý muốn.
                  </p>
                </div>
              </button>

              {/* Option 2: From templates */}
              <Link
                href="/templates"
                onClick={() => onOpenChange(false)}
                className="flex items-start gap-4 p-4 text-left rounded-xl
                  border border-border hover:border-muted-foreground/40
                  hover:bg-muted/40 transition-all group cursor-pointer"
              >
                <div
                  className="size-10 rounded-lg bg-blue-50 text-blue-600
                  flex items-center justify-center shrink-0
                  group-hover:scale-105 transition-transform"
                >
                  <LayoutTemplate className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className="font-semibold text-foreground text-sm
                      group-hover:text-blue-700 transition-colors"
                    >
                      Tạo từ Form mẫu có sẵn
                    </h4>
                    <ArrowRight
                      className="size-4 text-muted-foreground
                      group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Khám phá kho biểu mẫu mẫu chuẩn (Đơn từ, Hợp đồng, Đánh giá...) để tiết kiệm thời gian.
                  </p>
                </div>
              </Link>
            </div>
          </>
        )}

        {/* Step: Blank form input */}
        {step === 'blank_form' && (
          <form onSubmit={handleCreateBlankSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Thông tin biểu mẫu mới
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Nhập tên và mô tả ban đầu cho biểu mẫu của bạn.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-title" className="text-xs font-semibold">
                  Tên biểu mẫu <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="form-title"
                  placeholder="Ví dụ: Phiếu đánh giá chất lượng dịch vụ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-desc" className="text-xs font-semibold">
                  Mô tả ngắn (tùy chọn)
                </Label>
                <Input
                  id="form-desc"
                  placeholder="Ví dụ: Dùng để khảo sát ý kiến khách hàng tháng 8..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep('choose_mode')}
                disabled={isSubmitting}
                className="cursor-pointer text-xs"
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!title.trim() || isSubmitting}
                className="cursor-pointer text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  'Bắt đầu thiết kế'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}




