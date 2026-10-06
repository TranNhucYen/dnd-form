'use client';

import { useMemo, useEffect } from 'react';
import type { FormSchemaJson, CanvasField } from '@/features/form-builder/types/formBuilder.types';
import { importSchemaFieldToCanvasField } from '@/features/form-builder/domain/transformers';
import { toMm, toInternalUnit } from '@/features/form-builder/domain/units';
import { FieldRenderer } from '@/features/form-builder/fields/FieldRenderer';
import { usePrintReadiness } from './usePrintReadiness';

export interface PrintCanvasProps {
  schema?: FormSchemaJson | null;
}

/**
 * Canvas kết xuất trang in kích thước mm theo tọa độ thực 1:1
 */
export function PrintCanvas({ schema }: PrintCanvasProps) {
  // Kích thước trang in (mm)
  const { widthMm, heightMm } = useMemo(() => {
    const defaultWidth = 210;
    const defaultHeight = 297;

    const widthUnit =
      schema?.page?.dimensions?.width && schema.page.dimensions.width > 0
        ? schema.page.dimensions.width
        : toInternalUnit(defaultWidth);

    const heightUnit =
      schema?.page?.dimensions?.height && schema.page.dimensions.height > 0
        ? schema.page.dimensions.height
        : toInternalUnit(defaultHeight);

    return {
      widthMm: toMm(widthUnit),
      heightMm: toMm(heightUnit),
    };
  }, [schema?.page?.dimensions]);

  // Chuyển đổi tọa độ schema sang pixel
  const canvasFields = useMemo<CanvasField[]>(() => {
    if (!schema?.fields || !Array.isArray(schema.fields)) return [];
    return schema.fields.map(importSchemaFieldToCanvasField);
  }, [schema?.fields]);

  // Đếm số editor TipTap cần đợi mount
  const expectedTipTapCount = useMemo(() => {
    return canvasFields.filter(
      (f) => f.type === 'datatable' || f.type === 'textarea'
    ).length;
  }, [canvasFields]);

  // Đồng bộ trạng thái sẵn sàng với Puppeteer
  usePrintReadiness({ expectedTipTapCount });

  return (
    <>
      <style>{`@page { size: ${widthMm}mm ${heightMm}mm; margin: 0mm !important; }`}</style>
      <div
        className="print-canvas relative bg-white overflow-hidden select-none"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          maxWidth: `${widthMm}mm`,
          maxHeight: `${heightMm}mm`,
          boxSizing: 'border-box',
        }}
      >
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
    </>
  );
}
