'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TemplateCanvasPreview } from './TemplateCanvasPreview'
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

const ZOOM_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5]

export function TemplateZoomModal({
  open,
  onOpenChange,
  templateName,
  schema,
  onUseTemplate,
  isCopying = false,
}: TemplateZoomModalProps) {
  const [zoomIndex, setZoomIndex] = useState(2) // 1.0 (100%) mặc định
  const currentScale = ZOOM_STEPS[zoomIndex]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl md:max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header Toolbar */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-3 border-b shrink-0 bg-white">
          <div className="flex flex-col gap-0.5 text-left pr-4">
            <DialogTitle className="text-base font-bold truncate max-w-sm sm:max-w-md">
              {templateName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Xem trước kích thước chuẩn bản in
            </DialogDescription>
          </div>

          <div className="flex items-center gap-3 pr-8">
            {/* Bộ điều khiển thu phóng */}
            <div className="flex items-center gap-1 border border-border bg-muted/50 rounded-lg p-0.5">
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
                onClick={() => setZoomIndex(2)}
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
                  <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                ) : (
                  <Copy className="size-3.5" data-icon="inline-start" />
                )}
                {isCopying ? 'Đang tạo bản sao...' : 'Sử dụng biểu mẫu'}
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Viewport xem trước cuộn trang */}
        <div className="flex-1 overflow-auto bg-slate-50 p-8 flex">
          <div className="m-auto shadow-md">
            <TemplateCanvasPreview
              schema={schema}
              scale={currentScale}
              showZoomHint={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
