'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Pencil,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { MyForm, FormStatus } from '../types/my-form.type'

interface PreviewFormModalProps {
  form: MyForm | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewFormModal({
  form,
  open,
  onOpenChange,
}: PreviewFormModalProps) {
  if (!form) return null

  const renderStatusBadge = () => {
    switch (form.status) {
      case FormStatus.ACTIVE:
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold"
          >
            Đang sử dụng
          </Badge>
        )
      case FormStatus.DRAFT:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold"
          >
            Bản nháp
          </Badge>
        )
      case FormStatus.ARCHIVED:
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-border text-xs font-semibold"
          >
            Đã lưu trữ
          </Badge>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div className="flex items-center gap-2.5">
              <DialogTitle className="text-xl font-bold text-foreground truncate max-w-[420px]">
                {form.title}
              </DialogTitle>
              {renderStatusBadge()}
            </div>
          </div>
          <DialogDescription className="text-muted-foreground text-xs">
            Xem trước giao diện biểu mẫu trên khung thiết kế dạng giấy (Paper Canvas).
          </DialogDescription>
        </DialogHeader>

        {/* Paper Canvas Mockup */}
        <div
          className="p-6 bg-muted/50 rounded-xl border border-border
          flex justify-center"
        >
          <Card
            className="w-full max-w-[500px] shadow-md p-6 sm:p-8
            flex flex-col gap-6"
          >
            {/* Header of the Form */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-foreground">{form.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {form.description || 'Vui lòng điền đầy đủ các thông tin cần thiết bên dưới.'}
              </p>
            </div>

            <Separator />

            {/* Mock Fields on Canvas */}
            <div className="flex flex-col gap-4">
              {/* Field 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Họ và tên người điền <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-normal">Text Input</span>
                </div>
                <div
                  className="h-8 rounded-md border border-border bg-muted/30
                  px-3 text-xs text-muted-foreground flex items-center"
                >
                  Nhập câu trả lời...
                </div>
              </div>

              {/* Field 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Bộ phận / Phòng ban <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-normal">Select Box</span>
                </div>
                <div
                  className="h-8 rounded-md border border-border bg-muted/30
                  px-3 text-xs text-muted-foreground flex items-center justify-between"
                >
                  <span>Chọn phòng ban...</span>
                  <ChevronDown className="size-3.5" />
                </div>
              </div>

              {/* Field 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Ngày thực hiện
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-normal">Date Picker</span>
                </div>
                <div
                  className="h-8 rounded-md border border-border bg-muted/30
                  px-3 text-xs text-muted-foreground flex items-center gap-2"
                >
                  <Calendar className="size-3.5" />
                  <span>dd/mm/yyyy</span>
                </div>
              </div>

              {/* Field 4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Nội dung chi tiết
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-normal">Text Area</span>
                </div>
                <div
                  className="h-16 rounded-md border border-border bg-muted/30
                  p-2.5 text-xs text-muted-foreground"
                >
                  Ghi chú hoặc ý kiến đóng góp...
                </div>
              </div>
            </div>

            <Separator />

            {/* Form Footer */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Được tạo bằng DragForm Canvas</span>
              <span>Tổng số trường: {form.fieldsCount || 4}</span>
            </div>
          </Card>
        </div>

        {/* Quick Specs & Actions */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center
          gap-4 pt-2"
        >
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5" /> {form.fieldsCount} trường dữ liệu
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" /> Cập nhật: {form.formattedUpdatedAt}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none cursor-pointer text-xs"
            >
              Đóng
            </Button>
            <Link href={`/editor?formId=${form.id}`} className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full cursor-pointer text-xs">
                <Pencil data-icon="inline-start" />
                Mở trong Editor
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

