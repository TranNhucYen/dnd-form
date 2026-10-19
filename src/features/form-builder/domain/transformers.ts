import { pxToInternalUnit, toInternalUnit, toMm, toScreenPx } from "./units";
import { PAGE_PRESETS } from "../constants/form.constants";
import type {
  BackgroundPdfMetadata,
  CanvasField,
  CanvasPage,
  FormPageSchema,
  FormSchemaJson,
  Orientation,
  PageMargins,
  PagePresetKey,
  PageSize,
  SchemaField,
} from "../types/formBuilder.types";

/**
 * Chuyển chuỗi lề (mm) sang number, trả về 0 nếu không hợp lệ hoặc âm
 */
export function parseMarginMm(value: string | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * Tính toán kích thước page dựa trên preset và hướng xoay (PORTRAIT / LANDSCAPE)
 */
export function getEffectivePageDimensions(
  pageSizePreset: PagePresetKey,
  orientation: Orientation,
): PageSize {
  const baseSize = PAGE_PRESETS[pageSizePreset] ?? PAGE_PRESETS.A4;
  if (orientation === "LANDSCAPE") {
    return {
      width: baseSize.height,
      height: baseSize.width,
    };
  }
  return {
    width: baseSize.width,
    height: baseSize.height,
  };
}

/**
 * Chuyển field từ Canvas (px) sang Schema (InternalUnit)
 */
export function exportCanvasFieldToSchemaField(field: CanvasField): SchemaField {
  return {
    id: field.id,
    type: field.type,
    x: pxToInternalUnit(field.x),
    y: pxToInternalUnit(field.y),
    width: pxToInternalUnit(field.width),
    height: pxToInternalUnit(field.height),
    style: structuredClone(field.style),
    data: structuredClone(field.data),
  } as SchemaField;
}

/**
 * Chuyển field từ Schema (InternalUnit) sang Canvas (px)
 */
export function importSchemaFieldToCanvasField(field: SchemaField): CanvasField {
  return {
    id: field.id,
    type: field.type,
    x: toScreenPx(field.x),
    y: toScreenPx(field.y),
    width: toScreenPx(field.width),
    height: toScreenPx(field.height),
    style: structuredClone(field.style),
    data: structuredClone(field.data),
  } as CanvasField;
}

/**
 * Chuyển đổi 1 CanvasPage sang FormPageSchema
 */
export function exportCanvasPageToSchemaPage(page: CanvasPage): FormPageSchema {
  const dimensions = getEffectivePageDimensions(page.pageSizePreset, page.orientation);
  return {
    id: page.id,
    pageNumber: page.pageNumber,
    ...(page.name ? { name: page.name } : {}),
    page: {
      preset: page.pageSizePreset,
      orientation: page.orientation,
      margins: {
        top: toInternalUnit(parseMarginMm(page.margins.top)),
        bottom: toInternalUnit(parseMarginMm(page.margins.bottom)),
        left: toInternalUnit(parseMarginMm(page.margins.left)),
        right: toInternalUnit(parseMarginMm(page.margins.right)),
      },
      dimensions: {
        width: toInternalUnit(dimensions.width),
        height: toInternalUnit(dimensions.height),
      },
    },
    fields: page.fields.map(exportCanvasFieldToSchemaField),
    ...(page.pdfPageNumber !== undefined ? { pdfPageNumber: page.pdfPageNumber } : {}),
  };
}

/**
 * Chuyển đổi 1 FormPageSchema sang CanvasPage
 */
export function importSchemaPageToCanvasPage(schemaPage: FormPageSchema): CanvasPage {
  return {
    id: schemaPage.id,
    pageNumber: schemaPage.pageNumber,
    name: schemaPage.name,
    pageSizePreset: schemaPage.page.preset,
    orientation: schemaPage.page.orientation,
    margins: {
      top: toMm(schemaPage.page.margins.top).toString(),
      bottom: toMm(schemaPage.page.margins.bottom).toString(),
      left: toMm(schemaPage.page.margins.left).toString(),
      right: toMm(schemaPage.page.margins.right).toString(),
    },
    fields: schemaPage.fields.map(importSchemaFieldToCanvasField),
    pdfPageNumber: schemaPage.pdfPageNumber,
  };
}

/**
 * Xuất FormSchemaJson từ danh sách CanvasPage[] và backgroundPdf metadata
 */
export function exportFormSchema(
  pages: CanvasPage[],
  backgroundPdf?: BackgroundPdfMetadata,
): FormSchemaJson {
  return {
    pages: pages.map(exportCanvasPageToSchemaPage),
    ...(backgroundPdf ? { backgroundPdf: structuredClone(backgroundPdf) } : {}),
  };
}

