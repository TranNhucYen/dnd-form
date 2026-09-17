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
import { Loader2, Plus, Pencil } from 'lucide-react'
import { Category } from '../types/category.type'
import { slugify } from '../utils/slugify'

export interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSave: (name: string, id?: number) => Promise<unknown> | void
}

// Modal dùng chung cho cả 2 thao tác: Thêm mới và Đổi tên loại biểu mẫu
export function Modal({
  open,
  onOpenChange,
  category = null,
  onSave,
}: CategoryModalProps) {
  const isEditMode = Boolean(category)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setErrorMessage('')
    }
  }, [open, category])

  const handleClose = () => {
    setErrorMessage('')
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setErrorMessage('Vui lòng nhập tên loại biểu mẫu')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    try {
      if (isEditMode && category) {
        await onSave(trimmed, category.id)
      } else {
        await onSave(trimmed)
      }
      handleClose()
    } catch {
      setErrorMessage(
        isEditMode
          ? 'Có lỗi xảy ra khi cập nhật tên loại biểu mẫu'
          : 'Có lỗi xảy ra khi tạo loại biểu mẫu'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewSlug = name.trim() ? slugify(name.trim()) : ''
  const isSaveDisabled =
    isSubmitting ||
    !name.trim() ||
    (isEditMode && category ? name.trim() === category.name : false)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-1 text-left">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Pencil className="size-4 text-primary" />
                  Đổi tên loại biểu mẫu
                </>
              ) : (
                <>
                  <Plus className="size-4 text-primary" />
                  Thêm loại biểu mẫu mới
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditMode && category ? (
                <>
                  Cập nhật tên mới cho loại biểu mẫu{' '}
                  <strong className="font-semibold text-foreground">
                    "#{category.id} - {category.name}"
                  </strong>
                  .
                </>
              ) : (
                'Nhập tên loại biểu mẫu để tạo danh mục phân loại mới trong hệ thống.'
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-1">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="category-name-input"
                className="text-xs font-semibold text-foreground"
              >
                Tên loại biểu mẫu <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="category-name-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                placeholder={
                  isEditMode
                    ? 'Nhập tên mới...'
                    : 'Ví dụ: Đơn xin việc, Khảo sát thị trường...'
                }
                className="text-xs h-9"
                disabled={isSubmitting}
                autoFocus
              />
              {errorMessage && (
                <span className="text-[11px] text-rose-500">{errorMessage}</span>
              )}
            </div>

            {previewSlug && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-[11px]">
                  {isEditMode ? 'Đường dẫn mới:' : 'Đường dẫn mẫu:'}
                </span>
                <span className="font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded text-foreground">
                  /{previewSlug}
                </span>
              </div>
            )}
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
              disabled={isSaveDisabled}
              className="cursor-pointer text-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  {isEditMode ? 'Đang lưu...' : 'Đang tạo...'}
                </>
              ) : isEditMode ? (
                'Lưu thay đổi'
              ) : (
                'Thêm loại biểu mẫu'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
