import { useEffect, useEffectEvent, useRef, useState } from "react";
import type {
  CanvasField,
  FieldResizeChange,
  MarginBounds,
} from "../types/canvas.types";
import {
  calculateResizeSnapAndGuides,
  getCollidingFieldIds,
  isOutsideCanvas,
  type AlignmentGuide,
} from "../utils";
import {
  calculateResizeBounds,
  type Rect,
  type ResizeHandle,
} from "../../domain/geometry";

export type UseFieldResizeOptions = {
  elementRef: React.RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  controlledSize?: { width: number; height: number };
  fields?: CanvasField[];
  canvasSize?: { width: number; height: number };
  margins?: MarginBounds;
  onGuidesChange?: (guides: AlignmentGuide[]) => void;
  onResize?: (change: FieldResizeChange) => void;
  onMeasure?: (size: { width: number; height: number }) => void;
  onCollisionChange?: (isColliding: boolean) => void;
  onCollidingFieldsChange?: (collidingIds: string[]) => void;
  id: string;
};

/**
 * useFieldResize: Hook xử lý co giãn kích thước của một Field kết hợp Smart Guides & Snapping
 */
export function useFieldResize({
  elementRef,
  position,
  controlledSize,
  fields,
  canvasSize,
  margins,
  onGuidesChange,
  onResize,
  onMeasure,
  onCollisionChange,
  onCollidingFieldsChange,
  id,
}: UseFieldResizeOptions) {
  const [resize, setResize] = useState<{
    handle: ResizeHandle;
    startX: number;
    startY: number;
    width: number;
    height: number;
    position: { x: number; y: number };
  } | null>(null);

  const initialBoundsRef = useRef<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);

  const pendingResizeRef = useRef<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);

  const isCollidingRef = useRef(false);

  const applyResizePreview = useEffectEvent((nextResize: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  }) => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    element.style.left = `${nextResize.position.x}px`;
    element.style.top = `${nextResize.position.y}px`;
    element.style.width = `${nextResize.size.width}px`;
    element.style.height = `${nextResize.size.height}px`;
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !onMeasure) {
      return;
    }

    const measure = () => {
      onMeasure({ width: element.offsetWidth, height: element.offsetHeight });
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [id, onMeasure, elementRef]);

  const handlePointerMove = useEffectEvent((event: PointerEvent) => {
    if (!resize) {
      return;
    }

    const rawBounds = calculateResizeBounds({
      handle: resize.handle,
      startPosition: resize.position,
      startSize: { width: resize.width, height: resize.height },
      deltaX: event.clientX - resize.startX,
      deltaY: event.clientY - resize.startY,
    });

    let nextBounds = rawBounds;

    // Hít đường gióng khi resize (Smart Guides và Snapping)
    if (fields && canvasSize) {
      const snap = calculateResizeSnapAndGuides(
        rawBounds,
        resize.handle,
        fields,
        canvasSize,
        id,
        undefined,
        margins,
      );
      nextBounds = snap.bounds;
      onGuidesChange?.(snap.guides);
    }

    pendingResizeRef.current = nextBounds;
    applyResizePreview(nextBounds);

    const element = elementRef.current;
    const canvas =
      element?.closest<HTMLDivElement>('[data-droppable-id="canvas"]') ??
      (element?.parentElement as HTMLDivElement | null);

    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const proposedRect: Rect = {
        left: canvasRect.left + nextBounds.position.x,
        top: canvasRect.top + nextBounds.position.y,
        width: nextBounds.size.width,
        height: nextBounds.size.height,
      };

      const outsideCanvas = isOutsideCanvas(canvasRect, proposedRect);
      const collidingIds = getCollidingFieldIds(canvas, proposedRect, id);
      const hasCollision = outsideCanvas || collidingIds.length > 0;

      isCollidingRef.current = hasCollision;
      onCollidingFieldsChange?.(hasCollision ? [...collidingIds, id] : []);
      onCollisionChange?.(hasCollision);
    }
  });

  const handlePointerUp = useEffectEvent(() => {
    setResize(null);
    onGuidesChange?.([]);

    const element = elementRef.current;
    const canvas =
      element?.closest<HTMLDivElement>('[data-droppable-id="canvas"]') ??
      (element?.parentElement as HTMLDivElement | null);

    let hasCollision = isCollidingRef.current;
    const finalResize = pendingResizeRef.current;

    if (canvas && finalResize) {
      const canvasRect = canvas.getBoundingClientRect();
      const proposedRect: Rect = {
        left: canvasRect.left + finalResize.position.x,
        top: canvasRect.top + finalResize.position.y,
        width: finalResize.size.width,
        height: finalResize.size.height,
      };

      const outsideCanvas = isOutsideCanvas(canvasRect, proposedRect);
      const collidingIds = getCollidingFieldIds(canvas, proposedRect, id);
      hasCollision = outsideCanvas || collidingIds.length > 0;
    }

    const initialBounds = initialBoundsRef.current;

    onCollidingFieldsChange?.([]);
    onCollisionChange?.(false);
    isCollidingRef.current = false;

    if (hasCollision && initialBounds) {
      applyResizePreview(initialBounds);
    } else if (finalResize) {
      onResize?.(finalResize);
    }

    pendingResizeRef.current = null;
    initialBoundsRef.current = null;
  });

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const startResize = (handle: ResizeHandle, event: React.PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = elementRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const currentWidth = controlledSize?.width ?? rect.width;
    const currentHeight = controlledSize?.height ?? rect.height;

    initialBoundsRef.current = {
      position: { ...position },
      size: { width: currentWidth, height: currentHeight },
    };

    setResize({
      handle,
      startX: event.clientX,
      startY: event.clientY,
      width: currentWidth,
      height: currentHeight,
      position,
    });
  };

  return {
    isResizing: resize !== null,
    startResize,
  };
}
