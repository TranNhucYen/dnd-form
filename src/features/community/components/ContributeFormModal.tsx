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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UploadCloud, Info, Loader2, CheckCircle2 } from 'lucide-react'
import { COMMUNITY_CATEGORIES } from '../constants/community.constant'
import { ContributeFormInput } from '../types/community.type'

interface ContributeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitContribution: (input: ContributeFormInput) => Promise<unknown>
}

// Mock my forms for selection
const AVAILABLE_USER_FORMS = [
  { id: 1, title: 'Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026', category: 'Khảo sát & Ý kiến' },
  { id: 2, title: 'Đơn xin nghỉ phép - Phòng Kỹ thuật', category: 'Hành chính - Nhân sự' },
  { id: 4, title: 'Biên bản bàn giao thiết bị làm việc', category: 'Hành chính - Nhân sự' },
  { id: 6, title: 'Phiếu đánh giá hiệu suất nhân viên cuối năm', category: 'Hành chính - Nhân sự' },
]

export function ContributeFormModal({
  open,
  onOpenChange,
  onSubmitContribution,
}: ContributeFormModalProps) {
  const [selectedFormId, setSelectedFormId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(COMMUNITY_CATEGORIES[1])
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFormSelect = (formIdStr: string) => {
    setSelectedFormId(formIdStr)
    const found = AVAILABLE_USER_FORMS.find((f) => f.id.toString() === formIdStr)
    if (found) {
      setTitle(found.title)
      setCategory(found.category)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormId || !title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmitContribution({
        sourceFormId: Number(selectedFormId),
        title: title.trim(),
        categoryName: category,
        description: description.trim(),
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onOpenChange(false)
        setSelectedFormId('')
        setTitle('')
        setDescription('')
      }, 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Đóng góp biểu mẫu vào cộng đồng</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Chia sẻ biểu mẫu hữu ích của bạn để mọi người cùng sử dụng
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="size-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Gửi đóng góp thành công!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Biểu mẫu của bạn đang ở trạng thái chờ xét duyệt bởi ban quản trị.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <Alert className="bg-muted/50 border-muted">
              <Info className="size-4" />
              <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Quy tắc cộng đồng:</span> Template sẽ được tạo từ bản sao độc lập, hoàn toàn không ảnh hưởng đến biểu mẫu cá nhân và dữ liệu phản hồi của bạn.
              </AlertDescription>
            </Alert>

            {/* Select Form from My Forms */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source-form" className="text-xs font-semibold">
                Chọn biểu mẫu của bạn <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedFormId} onValueChange={handleFormSelect}>
                <SelectTrigger id="source-form" className="w-full text-xs">
                  <SelectValue placeholder="Chọn biểu mẫu muốn chia sẻ..." />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_USER_FORMS.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()} className="text-xs">
                      {f.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Form Title in Community */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="community-title" className="text-xs font-semibold">
                Tên hiển thị trên cộng đồng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="community-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên biểu mẫu rõ ràng, dễ tìm kiếm..."
                className="text-xs"
                required
              />
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="community-category" className="text-xs font-semibold">
                Danh mục phù hợp <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="community-category" className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNITY_CATEGORIES.filter((c) => c !== 'Tất cả').map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="community-description" className="text-xs font-semibold">
                Mô tả & Hướng dẫn sử dụng
              </Label>
              <Textarea
                id="community-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả mục đích sử dụng và các trường nổi bật của biểu mẫu..."
                className="text-xs min-h-20 resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !selectedFormId || !title.trim()}
                className="text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi xét duyệt'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
