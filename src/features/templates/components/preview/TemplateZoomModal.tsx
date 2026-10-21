'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DragDropProvider } from '@dnd-kit/react'
import { FormCanvas } from '@/features/form-builder/canvas/FormCanvas'
import { VerticalPageSelector } from '@/features/form-builder/page-tab/VerticalPageSelector'
import { useFormBuilderStore } from '@/features/form-builder/store/useFormBuilderStore'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'
import { ZoomIn, ZoomOut, Copy, Loader2 } from 'lucide-react'

export interface TemplateZoomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateName: string
  schema?: FormSchemaJson | null
  onUseTemplate?: () => void
  isCopying?: boolean
}

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1.0, 1.15, 1.3]

export function TemplateZoomModal({
  open,
  onOpenChange,
  templateName,
  schema,
  onUseTemplate,
  isCopying = false,
}: TemplateZoomModalProps) {
  const [zoomIndex, setZoomIndex] = useState(3) // 1.0 (100%) mặc định
  const currentScale = ZOOM_STEPS[zoomIndex]

  const loadFormSchema = useFormBuilderStore((state) => state.loadFormSchema)
  const resetForm = useFormBuilderStore((state) => state.resetForm)
  const setIsReadOnly = useFormBuilderStore((state) => state.setIsReadOnly)
  const pages = useFormBuilderStore((state) => state.pages)

  // Nạp schema vào Store khi mở modal và reset khi đóng modal
  useEffect(() => {
    if (open && schema) {
      setIsReadOnly(true)
      loadFormSchema(schema)
      setZoomIndex(3) // Đặt lại 100% khi mở
    }
    return () => {
      if (open) {
        resetForm()
      }
    }
  }, [open, schema, loadFormSchema, resetForm, setIsReadOnly])

  const totalPages = pages.length || schema?.pages?.length || 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl md:max-w-6xl w-[96vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        {/* Header Toolbar */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-3 border-b shrink-0 bg-background/95 backdrop-blur-xs">
          <div className="flex flex-col gap-1 text-left pr-4 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-base font-bold truncate max-w-sm sm:max-w-md">
                {templateName}
              </DialogTitle>
              {totalPages > 1 && (
                <Badge variant="outline" className="text-xs font-normal">
                  {totalPages} trang
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Bản xem trước biểu mẫu chuẩn (Read-only)
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 pr-8 shrink-0">
            {/* Bộ điều khiển thu phóng */}
            <div className="hidden sm:flex items-center gap-1 border border-border bg-muted/50 rounded-lg p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setZoomIndex((i) => Math.max(i - 1, 0))}
                disabled={zoomIndex === 0}
                className="size-7 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="size-3.5" />
              </Button>

              <button
                type="button"
                onClick={() => setZoomIndex(3)}
                className="text-xs font-semibold px-2 py-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                title="Đặt lại 100%"
              >
                {Math.round(currentScale * 100)}%
              </button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setZoomIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1))}
                disabled={zoomIndex === ZOOM_STEPS.length - 1}
                className="size-7 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="size-3.5" />
              </Button>
            </div>

            {/* Nút hành động Tạo bản sao */}
            {onUseTemplate && (
              <Button
                size="sm"
                onClick={onUseTemplate}
                disabled={isCopying}
                className="gap-1.5 cursor-pointer text-xs font-semibold h-8"
              >
                {isCopying ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{isCopying ? 'Đang tạo bản sao...' : 'Sử dụng biểu mẫu'}</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Viewport Canvas xem trước chuẩn có thanh chọn trang dọc */}
        <DragDropProvider>
          <div className="flex-1 min-h-0 overflow-auto bg-neutral-100/90 dark:bg-neutral-900/90 p-4 sm:p-8 flex justify-center">
            <div className="relative self-start flex items-start gap-4 m-auto">
              {/* Vùng Canvas phóng to/thu nhỏ */}
              <div className="relative shadow-xl rounded-sm">
                <div
                  style={{
                    transform: `scale(${currentScale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease',
                  }}
                  className="relative"
                >
                  <FormCanvas />
                  {/* Lớp kính chắn trong suốt ngăn chặn mọi tương tác sửa đổi trong chế độ xem trước */}
                  <div className="absolute inset-0 z-50 bg-transparent cursor-default" />
                </div>
              </div>

              {/* Thanh chọn trang bên phải (VerticalPageSelector) */}
              <VerticalPageSelector className="sticky top-[55%] -translate-y-1/2" />
            </div>
          </div>
        </DragDropProvider>
      </DialogContent>
    </Dialog>
  )
}
