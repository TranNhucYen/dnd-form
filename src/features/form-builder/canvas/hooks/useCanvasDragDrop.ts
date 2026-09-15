import { useDragDropMonitor } from "@dnd-kit/react";
import { useRef } from "react";
import type { Rect } from "../../domain/geometry";
import {
  calculateSnapAndGuides,
  getCollidingFieldIds,
  isOutsideCanvas,
  type AlignmentGuide,
} from "../utils";
import type { FieldType } from "../../types/formBuilder.types";
import { FIELD_DEFINITIONS_MAP, PALETTE_ITEM_CENTER } from "../../constants/fields.config";
import type { CanvasField, MarginBounds } from "../types/canvas.types";

export type UseCanvasDragDropOptions = {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  canvasSize: { width: number; height: number };
  margins?: MarginBounds;
  fields: CanvasField[];
  onGuidesChange?: (guides: AlignmentGuide[]) => void;
  onCollisionChange?: (isColliding: boolean) => void;
  setCollidingFieldIds: (ids: string[]) => void;
  onDropPosition: (
    sourceFieldId: string,
    coordinates: { x: number; y: number },
  ) => void;
  onDropNewField: (
    type: FieldType,
    coordinates: { x: number; y: number },
  ) => void;
};

function getEffectiveDraggedRect(
  shapeRect: Rect,
  sourceData?: { fieldId?: string; type?: FieldType; width?: number; height?: number },
): Rect {
  const isFromPalette = !sourceData?.fieldId;

  if (!isFromPalette) {
    return {
      left: shapeRect.left,
      top: shapeRect.top,
      width: sourceData?.width ?? shapeRect.width,
      height: sourceData?.height ?? shapeRect.height,
    };
  }

  const defaultSize = sourceData?.type
    ? FIELD_DEFINITIONS_MAP[sourceData.type]?.defaultSize
    : undefined;
  const width = sourceData?.width ?? defaultSize?.width ?? shapeRect.width;
  const height = sourceData?.height ?? defaultSize?.height ?? shapeRect.height;

  const shiftX = PALETTE_ITEM_CENTER.x - width / 2;
  const shiftY = PALETTE_ITEM_CENTER.y - height / 2;

  return {
    left: shapeRect.left + shiftX,
    top: shapeRect.top + shiftY,
    width,
    height,
  };
}

/**
 * useCanvasDragDrop: Hook xử lý kéo thả phần tử trên Canvas kết hợp Smart Guides và Snapping
 */
export function useCanvasDragDrop({
  canvasRef,
  canvasSize,
  margins,
  fields,
  onGuidesChange,
  onCollisionChange,
  setCollidingFieldIds,
  onDropPosition,
  onDropNewField,
}: UseCanvasDragDropOptions) {
  const rawShapeRectRef = useRef<Rect | null>(null);

  useDragDropMonitor({
    onDragStart: () => {
      rawShapeRectRef.current = null;
      setCollidingFieldIds([]);
      onCollisionChange?.(false);
      onGuidesChange?.([]);
    },

    onDragMove: (event) => {
      const shapeRect = event.operation.shape?.current.boundingRectangle;

      if (shapeRect) {
        rawShapeRectRef.current = shapeRect;

        const sourceData = event.operation.source?.data as
          | { fieldId?: string; type?: FieldType; width?: number; height?: number }
          | undefined;

        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }

        const canvasRect = canvas.getBoundingClientRect();
        const rawRect = getEffectiveDraggedRect(shapeRect, sourceData);

        // Tính toán tọa độ thô tương đối trên Canvas
        const rawCanvasPos = {
          x: rawRect.left - canvasRect.left,
          y: rawRect.top - canvasRect.top,
          width: rawRect.width,
          height: rawRect.height,
        };

        // Tính toán hít đường gióng (Smart Guides & Snapping)
        const snap = calculateSnapAndGuides(
          rawCanvasPos,
          fields,
          canvasSize,
          sourceData?.fieldId,
          undefined,
          margins,
        );

        onGuidesChange?.(snap.guides);

        // Bounding box sau khi hít (dùng để quét va chạm chính xác)
        const snappedRect: Rect = {
          left: canvasRect.left + snap.snappedX,
          top: canvasRect.top + snap.snappedY,
          width: rawRect.width,
          height: rawRect.height,
        };

        const collidingIds = getCollidingFieldIds(canvas, snappedRect, sourceData?.fieldId);
        const outsideCanvas = isOutsideCanvas(canvasRect, snappedRect);

        setCollidingFieldIds(collidingIds);
        onCollisionChange?.(collidingIds.length > 0 || outsideCanvas);
      }
    },

    onDragEnd: (event) => {
      setCollidingFieldIds([]);
      onCollisionChange?.(false);
      onGuidesChange?.([]);

      if (event.operation.canceled || event.operation.target?.id !== "canvas") {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const sourceData = event.operation.source?.data as
        | { fieldId?: string; type?: FieldType; width?: number; height?: number }
        | undefined;

      if (!sourceData?.type) {
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const rawShapeRect =
        rawShapeRectRef.current ??
        event.operation.shape?.current.boundingRectangle;

      if (!rawShapeRect) {
        return;
      }

      const rawRect = getEffectiveDraggedRect(rawShapeRect, sourceData);
      const rawCanvasPos = {
        x: rawRect.left - canvasRect.left,
        y: rawRect.top - canvasRect.top,
        width: rawRect.width,
        height: rawRect.height,
      };

      const snap = calculateSnapAndGuides(
        rawCanvasPos,
        fields,
        canvasSize,
        sourceData.fieldId,
        undefined,
        margins,
      );

      const finalRect: Rect = {
        left: canvasRect.left + snap.snappedX,
        top: canvasRect.top + snap.snappedY,
        width: rawRect.width,
        height: rawRect.height,
      };

      const sourceFieldId = sourceData.fieldId;
      const outsideCanvas = isOutsideCanvas(canvasRect, finalRect);
      const collidingIds = getCollidingFieldIds(
        canvas,
        finalRect,
        sourceFieldId,
      );
      const hasCollision = outsideCanvas || collidingIds.length > 0;

      if (hasCollision) {
        return;
      }

      const finalCoordinates = {
        x: snap.snappedX,
        y: snap.snappedY,
      };

      if (sourceData.fieldId) {
        onDropPosition(sourceData.fieldId, finalCoordinates);
        return;
      }

      onDropNewField(sourceData.type as FieldType, finalCoordinates);
      rawShapeRectRef.current = null;
    },
  });
}
