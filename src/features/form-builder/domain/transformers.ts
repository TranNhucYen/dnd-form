import { pxToInternalUnit, toInternalUnit, toScreenPx } from "./units";
import type {
  CanvasField,
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
 * Chuyển field từ Canvas (px) sang Schema (InternalUnit)
 */
export function exportCanvasFieldToSchemaField(field: CanvasField): SchemaField {
  return {
    id: field.id,
    type: field.type,
    x: pxToInternalUnit(field.x),
    y: pxToInternalUnit(field.y),
    ...(typeof field.width === "number" &&
      Number.isFinite(field.width) && { width: pxToInternalUnit(field.width) }),
    ...(typeof field.height === "number" &&
      Number.isFinite(field.height) && { height: pxToInternalUnit(field.height) }),
    ...(field.style && { style: structuredClone(field.style) }),
    ...(field.data && { data: structuredClone(field.data) }),
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
    ...(typeof field.width === "number" &&
      Number.isFinite(field.width) && { width: toScreenPx(field.width) }),
    ...(typeof field.height === "number" &&
      Number.isFinite(field.height) && { height: toScreenPx(field.height) }),
    ...(field.style && { style: structuredClone(field.style) }),
    ...(field.data && { data: structuredClone(field.data) }),
  } as CanvasField;
}

/**
 * Xuất FormSchemaJson với kích thước và tọa độ chuyển về InternalUnit
 */
export function exportFormSchema({
  pageSizePreset,
  orientation,
  margins,
  dimensions,
  fields,
}: {
  pageSizePreset: PagePresetKey;
  orientation: Orientation;
  margins: PageMargins;
  dimensions: PageSize;
  fields: CanvasField[];
}): FormSchemaJson {
  return {
    page: {
      preset: pageSizePreset,
      orientation,
      margins: {
        top: toInternalUnit(parseMarginMm(margins.top)),
        bottom: toInternalUnit(parseMarginMm(margins.bottom)),
        left: toInternalUnit(parseMarginMm(margins.left)),
        right: toInternalUnit(parseMarginMm(margins.right)),
      },
      dimensions: {
        width: toInternalUnit(dimensions.width),
        height: toInternalUnit(dimensions.height),
      },
    },
    fields: fields.map(exportCanvasFieldToSchemaField),
  };
}
