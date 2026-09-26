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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UploadCloud, Info, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import {
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
} from '../types/community.type'

interface ContributeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CommunityCategory[]
  userForms: UserFormOption[]
  onSubmitContribution: (input: ContributeFormInput) => Promise<unknown>
}

export function ContributeFormModal({
  open,
  onOpenChange,
  categories,
  userForms,
  onSubmitContribution,
}: ContributeFormModalProps) {
  const [selectedFormId, setSelectedFormId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [description, setDescription] = useState('')
  const [guidelines, setGuidelines] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id.toString())
    }
  }, [categories, categoryId])

  const handleFormSelect = (formIdStr: string) => {
    setSelectedFormId(formIdStr)
    const found = userForms.find((f) => f.id.toString() === formIdStr)
    if (found) {
      setTitle(found.title)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormId || !title.trim() || !categoryId) return

    setIsSubmitting(true)
    try {
      const cleanGuidelines = guidelines.map((g) => g.trim()).filter(Boolean)
      const selectedCat = categories.find((c) => c.id.toString() === categoryId)
      await onSubmitContribution({
        sourceFormId: Number(selectedFormId),
        title: title.trim(),
        categoryId: Number(categoryId),
        categoryName: selectedCat?.name,
        description: description.trim(),
        guidelines: cleanGuidelines,
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onOpenChange(false)
        setSelectedFormId('')
        setTitle('')
        setDescription('')
        setGuidelines([''])
      }, 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
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
          <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-1.5 pr-2.5 flex flex-col gap-4 py-1">
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
                    {userForms.map((f) => (
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
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="community-category" className="w-full text-xs">
                    <SelectValue placeholder="Chọn danh mục..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Section 1: Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="community-description" className="text-xs font-semibold">
                  Mô tả biểu mẫu
                </Label>
                <Textarea
                  id="community-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả mục đích sử dụng, ngữ cảnh áp dụng của biểu mẫu..."
                  className="text-xs min-h-20 max-h-24 resize-none overflow-y-auto leading-relaxed shadow-none"
                />
              </div>

              {/* Section 2: Guidelines */}
              <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Hướng dẫn sử dụng (Tùy chọn)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Thiết lập các bước chỉ dẫn để người khác điền đúng dữ liệu.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                    disabled={isSubmitting}
                    className="text-xs h-7 px-2.5 gap-1 shrink-0 cursor-pointer shadow-none"
                  >
                    <Plus className="size-3" />
                    Thêm bước
                  </Button>
                </div>

                {/* Danh sách các bước bọc trong ScrollArea */}
                <ScrollArea className="max-h-44 w-full pr-2">
                  <div className="flex flex-col gap-2 py-0.5">
                    {guidelines.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="size-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                          {index + 1}
                        </span>
                        <Input
                          value={step}
                          onChange={(e) => handleUpdateStep(index, e.target.value)}
                          placeholder={`Nhập hướng dẫn bước ${index + 1}...`}
                          className="text-xs h-8 flex-1 shadow-none"
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
                </ScrollArea>
              </div>
            </div>

            {/* Fixed Footer */}
            <DialogFooter className="shrink-0 pt-3 border-t mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="text-xs cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !selectedFormId || !title.trim() || !categoryId}
                className="text-xs cursor-pointer"
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
