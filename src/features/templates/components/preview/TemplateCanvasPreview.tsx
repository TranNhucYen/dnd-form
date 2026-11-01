'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import type { FormSchemaJson, CanvasField } from '@/features/form-builder/types/formBuilder.types'
import { importSchemaFieldToCanvasField } from '@/features/form-builder/domain/transformers'
import { toScreenPx, toInternalUnit } from '@/features/form-builder/domain/units'
import { FieldRenderer } from '@/features/form-builder/fields/FieldRenderer'
import { ZoomIn, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { loadPdfDocument, renderPdfPageToBlobUrl } from '@/lib/pdf-client/pdf-extractor'

export interface TemplateCanvasPreviewProps {
  schema?: FormSchemaJson | null
  className?: string
  scale?: number
  onZoomClick?: () => void
  showZoomHint?: boolean
}

export function TemplateCanvasPreview({
  schema,
  className,
  scale: controlledScale,
  onZoomClick,
  showZoomHint = true,
}: TemplateCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [firstPagePdfBlobUrl, setFirstPagePdfBlobUrl] = useState<string | null>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(false)

  const firstPage = schema?.pages?.[0]

  // Render trang 1 của file PDF nền (nếu form có backgroundPdf)
  useEffect(() => {
    const fileUrl = schema?.backgroundPdf?.fileUrl
    if (!fileUrl) {
      setFirstPagePdfBlobUrl(null)
      return
    }

    let isMounted = true
    let createdUrl: string | null = null
    setIsLoadingPdf(true)

    loadPdfDocument(fileUrl)
      .then(async (pdf) => {
        const blobUrl = await renderPdfPageToBlobUrl(pdf, 1)
        if (isMounted) {
          createdUrl = blobUrl
          setFirstPagePdfBlobUrl(blobUrl)
        } else {
          URL.revokeObjectURL(blobUrl)
        }
      })
      .catch(() => {
        console.warn('Không thể render trang 1 của PDF')
      })
      .finally(() => {
        if (isMounted) setIsLoadingPdf(false)
      })

    return () => {
      isMounted = false
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl)
      }
    }
  }, [schema?.backgroundPdf?.fileUrl])

  // Tính toán kích thước canvas gốc theo chuẩn InternalUnit
  const { canvasWidth, canvasHeight } = useMemo(() => {
    const defaultWidthUnit = toInternalUnit(210) // A4: 210mm
    const defaultHeightUnit = toInternalUnit(297) // A4: 297mm

    const widthUnit =
      firstPage?.page?.dimensions?.width && firstPage.page.dimensions.width > 0
        ? firstPage.page.dimensions.width
        : defaultWidthUnit
    const heightUnit =
      firstPage?.page?.dimensions?.height && firstPage.page.dimensions.height > 0
        ? firstPage.page.dimensions.height
        : defaultHeightUnit

    const widthPx = toScreenPx(widthUnit)
    const heightPx = toScreenPx(heightUnit)

    return {
      canvasWidth: widthPx,
      canvasHeight: heightPx,
    }
  }, [firstPage?.page?.dimensions])

  // Chuyển đổi các trường Schema sang CanvasField tọa độ pixel
  const canvasFields = useMemo<CanvasField[]>(() => {
    if (!firstPage?.fields || !Array.isArray(firstPage.fields)) return []
    return firstPage.fields.map(importSchemaFieldToCanvasField)
  }, [firstPage])

  const hasFields = canvasFields.length > 0

  // Đo chiều rộng container để tính auto scale (nếu không truyền scale cố định)
  useEffect(() => {
    if (controlledScale !== undefined) return

    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(el)
    setContainerWidth(el.clientWidth)

    return () => observer.disconnect()
  }, [controlledScale, hasFields])

  const effectiveScale =
    controlledScale ?? (containerWidth > 0 && canvasWidth > 0 ? containerWidth / canvasWidth : 1)
  const renderedWidth = canvasWidth * effectiveScale
  const renderedHeight = canvasHeight * effectiveScale

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden select-none group/preview',
        controlledScale === undefined && 'w-full',
        className
      )}
      style={{
        width: controlledScale !== undefined ? `${renderedWidth}px` : undefined,
        height: renderedHeight > 0 ? `${renderedHeight}px` : 'auto',
      }}
    >
      {/* Khung Canvas gốc được scale theo tỷ lệ tính toán */}
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${effectiveScale})`,
          transformOrigin: 'top left',
        }}
        className="relative bg-white shadow-xs border border-slate-200 pointer-events-none"
      >
        {/* Nền PDF trang 1 */}
        {firstPagePdfBlobUrl ? (
          <img
            src={firstPagePdfBlobUrl}
            alt="PDF Page 1 Preview"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
            style={{
              opacity: schema?.backgroundPdf?.opacity ?? 1,
            }}
          />
        ) : (
          schema?.backgroundPdf && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-neutral-50/70 z-0">
              <div className="flex flex-col items-center gap-2.5 p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 text-muted-foreground max-w-[85%] shadow-xs">
                {isLoadingPdf ? (
                  <Loader2 className="size-8 text-primary animate-spin" />
                ) : (
                  <FileText className="size-8 text-muted-foreground/60" />
                )}
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {isLoadingPdf
                    ? 'Đang tải trang 1...'
                    : schema.backgroundPdf.fileName || 'Tài liệu mẫu PDF'}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {schema.backgroundPdf.totalPages || schema.pages?.length || 1} trang • Nhấn để xem toàn bộ
                </span>
              </div>
            </div>
          )
        )}

        {/* Danh sách các trường hiển thị theo tọa độ thực */}
        {canvasFields.map((field) => (
          <div
            key={field.id}
            style={{
              position: 'absolute',
              left: `${field.x}px`,
              top: `${field.y}px`,
              width: `${field.width}px`,
              height: `${field.height}px`,
              boxSizing: 'border-box',
            }}
          >
            <div
              className="h-full w-full"
              style={{
                fontFamily: field.style?.fontFamily || 'Times New Roman',
                fontSize: field.style?.fontSize ? `${field.style.fontSize}px` : undefined,
                fontWeight: field.style?.fontWeight,
                fontStyle: field.style?.fontStyle,
                textDecoration: field.style?.textDecoration,
                textAlign: field.style?.textAlign,
                color: field.style?.color,
                backgroundColor: field.style?.backgroundColor,
              }}
            >
              <FieldRenderer
                type={field.type}
                id={field.id}
                width={field.width}
                height={field.height}
                data={field.data}
                style={field.style}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lớp kính chắn trong suốt ngăn chặn triệt để mọi sự kiện hover, click, focus vào các field con */}
      <div className="absolute inset-0 z-10 bg-transparent cursor-default" />

      {/* Lớp phủ tương tác phóng to */}
      {onZoomClick && showZoomHint && (
        <button
          type="button"
          onClick={onZoomClick}
          aria-label="Phóng to bản xem trước"
          className="absolute inset-0 z-20 flex items-center justify-center hover:bg-black/10 cursor-zoom-in"
        >
          <div
            className="
              opacity-0 group-hover/preview:opacity-100 flex items-center 
              gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-white text-xs shadow-md transition-opacity"
          >
            <ZoomIn className="size-3.5" />
            <span>Phóng to xem chi tiết</span>
          </div>
        </button>
      )}
    </div>
  )
}
