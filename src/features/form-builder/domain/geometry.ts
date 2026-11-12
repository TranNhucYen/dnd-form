/**
 * Kiểu dữ liệu hình chữ nhật 2D cơ bản (AABB - Axis-Aligned Bounding Box)
 */
export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Kích thước tối thiểu (px) của một phần tử để tránh bị thu nhỏ về 0px
 */
export const MIN_FIELD_SIZE = 24;

/**
 * 8 hướng của khung resize
 */
export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export type ResizeBounds = {
  position: { x: number; y: number };
  size: { width: number; height: number };
};

export type CalculateResizeParams = {
  handle: ResizeHandle;
  startPosition: { x: number; y: number };
  startSize: { width: number; height: number };
  deltaX: number;
  deltaY: number;
  minSize?: number;
};


export function rectanglesOverlap(first: Rect, second: Rect): boolean {
  // DOM layout and unit conversion can produce subpixel edges. Ignore overlap
  // smaller than half a CSS pixel so touching fields do not report collisions.
  const overlapX =
    Math.min(first.left + first.width, second.left + second.width) -
    Math.max(first.left, second.left);
  const overlapY =
    Math.min(first.top + first.height, second.top + second.height) -
    Math.max(first.top, second.top);

  return overlapX > 0.5 && overlapY > 0.5;
}

export function calculateResizeBounds({
  handle,
  startPosition,
  startSize,
  deltaX,
  deltaY,
  minSize = MIN_FIELD_SIZE,
}: CalculateResizeParams): ResizeBounds {
  const changesWidth = handle.includes("e") || handle.includes("w");
  const changesHeight = handle.includes("n") || handle.includes("s");

  const width = Math.max(
    minSize,
    startSize.width + (handle.includes("w") ? -deltaX : deltaX),
  );
  const height = Math.max(
    minSize,
    startSize.height + (handle.includes("n") ? -deltaY : deltaY),
  );

  return {
    position: {
      x: startPosition.x + (handle.includes("w") ? startSize.width - width : 0),
      y: startPosition.y + (handle.includes("n") ? startSize.height - height : 0),
    },
    size: {
      width: changesWidth ? width : startSize.width,
      height: changesHeight ? height : startSize.height,
    },
  };
}
