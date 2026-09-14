import { rectanglesOverlap, type Rect } from "../../domain/geometry";

/**
 * Lấy danh sách ID các field bị va chạm với draggedRect trên Canvas
 */
export function getCollidingFieldIds(
  canvas: HTMLDivElement,
  draggedRect: Rect,
  sourceFieldId?: string,
): string[] {
  return Array.from(
    canvas.querySelectorAll<HTMLElement>("[data-field-id]"),
  )
    .filter((element) => (
      element.dataset.fieldId !== sourceFieldId &&
      rectanglesOverlap(draggedRect, element.getBoundingClientRect())
    ))
    .map((element) => element.dataset.fieldId)
    .filter((id): id is string => Boolean(id));
}

/**
 * Kiểm tra hình chữ nhật fieldRect có nằm ngoài biên Canvas hay không
 */
export function isOutsideCanvas(canvasRect: Rect, fieldRect: Rect): boolean {
  return (
    fieldRect.left < canvasRect.left ||
    fieldRect.top < canvasRect.top ||
    fieldRect.left + fieldRect.width > canvasRect.left + canvasRect.width ||
    fieldRect.top + fieldRect.height > canvasRect.top + canvasRect.height
  );
}
