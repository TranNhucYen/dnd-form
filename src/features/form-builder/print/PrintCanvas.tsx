'use client';

import { useMemo } from 'react';
import type { FormSchemaJson, CanvasField } from '@/features/form-builder/types/formBuilder.types';
import { importSchemaFieldToCanvasField } from '@/features/form-builder/domain/transformers';
import { toMm, toInternalUnit } from '@/features/form-builder/domain/units';
import { FieldRenderer } from '@/features/form-builder/fields/FieldRenderer';
import { usePrintReadiness } from './usePrintReadiness';

export interface PrintCanvasProps {
  schema?: FormSchemaJson | null;
}

/**
 * Canvas kết xuất tất cả các trang in kích thước mm theo tọa độ thực 1:1
 */
export function PrintCanvas({ schema }: PrintCanvasProps) {
  const pages = useMemo(() => {
    return schema?.pages ?? [];
  }, [schema?.pages]);

  // Kích thước mặc định của trang đầu tiên dùng cho @page
  const firstPageDimensions = useMemo(() => {
    const firstPage = pages[0];
    const widthUnit =
      firstPage?.page?.dimensions?.width && firstPage.page.dimensions.width > 0
        ? firstPage.page.dimensions.width
        : toInternalUnit(210);

    const heightUnit =
      firstPage?.page?.dimensions?.height && firstPage.page.dimensions.height > 0
        ? firstPage.page.dimensions.height
        : toInternalUnit(297);

    return {
      widthMm: toMm(widthUnit),
      heightMm: toMm(heightUnit),
    };
  }, [pages]);

  // Đếm tổng số editor TipTap trên tất cả các trang cần đợi mount
  const expectedTipTapCount = useMemo(() => {
    let count = 0;
    for (const page of pages) {
      if (!page.fields) continue;
      for (const field of page.fields) {
        if (field.type === 'datatable' || field.type === 'textarea') {
          count++;
        }
      }
    }
    return count;
  }, [pages]);

  // Đồng bộ trạng thái sẵn sàng với Puppeteer
  usePrintReadiness({ expectedTipTapCount });

  return (
    <>
      <style>{`
        @page {
          size: ${firstPageDimensions.widthMm}mm ${firstPageDimensions.heightMm}mm;
          margin: 0mm !important;
        }
        @media print {
          .print-page {
            break-after: page;
            page-break-after: always;
          }
          .print-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <div className="print-document flex flex-col items-center print:block">
        {pages.map((page, index) => {
          const wMm =
            page?.page?.dimensions?.width && page.page.dimensions.width > 0
              ? toMm(page.page.dimensions.width)
              : 210;

          const hMm =
            page?.page?.dimensions?.height && page.page.dimensions.height > 0
              ? toMm(page.page.dimensions.height)
              : 297;

          const canvasFields: CanvasField[] = Array.isArray(page.fields)
            ? page.fields.map(importSchemaFieldToCanvasField)
            : [];

          return (
            <div
              key={page.id || `page_${index}`}
              className="print-page relative bg-white overflow-hidden select-none print:shadow-none shadow-md mb-8 print:mb-0"
              style={{
                width: `${wMm}mm`,
                height: `${hMm}mm`,
                maxWidth: `${wMm}mm`,
                maxHeight: `${hMm}mm`,
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
          );
        })}
      </div>
    </>
  );
}
