'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import type { FormSchemaJson, CanvasField } from '@/features/form-builder/types/formBuilder.types'
import { importSchemaFieldToCanvasField } from '@/features/form-builder/domain/transformers'
import { toScreenPx, toInternalUnit } from '@/features/form-builder/domain/units'
import { FieldRenderer } from '@/features/form-builder/fields/FieldRenderer'
import { ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  // Tính toán kích thước canvas gốc theo chuẩn InternalUnit
  const { canvasWidth, canvasHeight } = useMemo(() => {
    const defaultWidthUnit = toInternalUnit(210) // A4: 210mm
    const defaultHeightUnit = toInternalUnit(297) // A4: 297mm

    const widthUnit =
      schema?.page?.dimensions?.width && schema.page.dimensions.width > 0
        ? schema.page.dimensions.width
        : defaultWidthUnit
    const heightUnit =
      schema?.page?.dimensions?.height && schema.page.dimensions.height > 0
        ? schema.page.dimensions.height
        : defaultHeightUnit

    const widthPx = toScreenPx(widthUnit)
    const heightPx = toScreenPx(heightUnit)

    return {
      canvasWidth: widthPx,
      canvasHeight: heightPx,
    }
  }, [schema?.page?.dimensions])

  // Chuyển đổi các trường Schema sang CanvasField tọa độ pixel
  const canvasFields = useMemo<CanvasField[]>(() => {
    if (!schema?.fields || !Array.isArray(schema.fields)) return []
    return schema.fields.map(importSchemaFieldToCanvasField)
  }, [schema?.fields])

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
        {/* Danh sách các trường hiển thị theo tọa độ thực */}
        {canvasFields.map((field) => (
          <div
            key={field.id}
            style={{
              position: 'absolute',
              left: `${field.x}px`,
              top: `${field.y}px`,
              width: field.width !== undefined ? `${field.width}px` : undefined,
              height: field.height !== undefined ? `${field.height}px` : undefined,
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
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lớp kính chắn trong suốt ngăn chặn triệt để mọi sự kiện hover, click, focus vào các field con */}
      <div className="absolute inset-0 z-10 bg-transparent cursor-default" />

      {/* Lớp phủ tương tác phóng to */}
      {onZoomClick && showZoomHint && hasFields && (
        <button
          type="button"
          onClick={onZoomClick}
          aria-label="Phóng to bản xem trước"
          className="absolute inset-0 z-20 flex items-center justify-center hover:bg-black/10 cursor-zoom-in"
        >
          <div
            className="
              opacity-0 group-hover/preview:opacity-100 flex items-center 
              gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-white text-xs"
          >
            <ZoomIn className="size-3.5" />
            <span>Phóng to xem chi tiết</span>
          </div>
        </button>
      )}
    </div>
  )
}
