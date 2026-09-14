import type {
  CanvasField,
  FieldResizeChange,
  MarginBounds,
} from "../types/canvas.types";
import { FIELD_DEFINITIONS_MAP } from "../../constants/fields.config";
import { SNAP_THRESHOLD } from "../../constants/form.constants";
import { MIN_FIELD_SIZE, type ResizeHandle } from "../../domain/geometry";

export type AlignmentGuide = {
  type: "vertical" | "horizontal";
  position: number;
};

export type SnapResult = {
  snappedX: number;
  snappedY: number;
  guides: AlignmentGuide[];
};

export type ResizeSnapResult = {
  bounds: FieldResizeChange;
  guides: AlignmentGuide[];
};

/**
 * Thu thập tất cả các đường gióng mục tiêu trên Canvas (mép canvas, lề trang và các phần tử khác)
 */
function getTargetGuideLines(
  otherFields: CanvasField[],
  canvasSize: { width: number; height: number },
  sourceFieldId?: string,
  margins?: MarginBounds,
) {
  const targetXLines = new Set<number>();
  const targetYLines = new Set<number>();

  // Thêm các đường gióng của Canvas (mép trái, giữa, mép phải)
  targetXLines.add(0);
  targetXLines.add(canvasSize.width / 2);
  targetXLines.add(canvasSize.width);

  // Thêm các đường gióng của Canvas (mép trên, giữa, mép dưới)
  targetYLines.add(0);
  targetYLines.add(canvasSize.height / 2);
  targetYLines.add(canvasSize.height);

  // Thêm các đường gióng của Lề trang (Margin)
  if (margins) {
    if (margins.left > 0) {
      targetXLines.add(margins.left);
    }
    if (margins.right > 0) {
      targetXLines.add(canvasSize.width - margins.right);
    }
    if (margins.top > 0) {
      targetYLines.add(margins.top);
    }
    if (margins.bottom > 0) {
      targetYLines.add(canvasSize.height - margins.bottom);
    }
  }

  // Thêm các đường gióng từ các field khác trên Canvas
  for (const field of otherFields) {
    if (field.id === sourceFieldId) {
      continue;
    }

    const defaultSize = FIELD_DEFINITIONS_MAP[field.type]?.defaultSize;
    const fWidth = field.width ?? defaultSize?.width ?? 0;
    const fHeight = field.height ?? defaultSize?.height ?? 0;

    targetXLines.add(field.x);
    targetXLines.add(field.x + fWidth / 2);
    targetXLines.add(field.x + fWidth);

    targetYLines.add(field.y);
    targetYLines.add(field.y + fHeight / 2);
    targetYLines.add(field.y + fHeight);
  }

  return { targetXLines, targetYLines };
}

/**
 * Tính toán tọa độ hít (Snap) và danh sách đường gióng khi KÉO DI CHUYỂN phần tử
 */
export function calculateSnapAndGuides(
  proposed: { x: number; y: number; width: number; height: number },
  otherFields: CanvasField[],
  canvasSize: { width: number; height: number },
  sourceFieldId?: string,
  threshold = SNAP_THRESHOLD,
  margins?: MarginBounds,
): SnapResult {
  const { targetXLines, targetYLines } = getTargetGuideLines(
    otherFields,
    canvasSize,
    sourceFieldId,
    margins,
  );

  let snappedX = proposed.x;
  let minDeltaX = threshold + 1;
  let activeGuideX: number | null = null;

  const activeXPoints = [
    { current: proposed.x }, // Left
    { current: proposed.x + proposed.width / 2 }, // Center
    { current: proposed.x + proposed.width }, // Right
  ];

  for (const targetX of targetXLines) {
    for (const point of activeXPoints) {
      const delta = targetX - point.current;
      if (Math.abs(delta) <= threshold && Math.abs(delta) < minDeltaX) {
        minDeltaX = Math.abs(delta);
        snappedX = proposed.x + delta;
        activeGuideX = targetX;
      }
    }
  }

  let snappedY = proposed.y;
  let minDeltaY = threshold + 1;
  let activeGuideY: number | null = null;

  const activeYPoints = [
    { current: proposed.y }, // Top
    { current: proposed.y + proposed.height / 2 }, // Center
    { current: proposed.y + proposed.height }, // Bottom
  ];

  for (const targetY of targetYLines) {
    for (const point of activeYPoints) {
      const delta = targetY - point.current;
      if (Math.abs(delta) <= threshold && Math.abs(delta) < minDeltaY) {
        minDeltaY = Math.abs(delta);
        snappedY = proposed.y + delta;
        activeGuideY = targetY;
      }
    }
  }

  const guides: AlignmentGuide[] = [];
  if (activeGuideX !== null) {
    guides.push({ type: "vertical", position: activeGuideX });
  }
  if (activeGuideY !== null) {
    guides.push({ type: "horizontal", position: activeGuideY });
  }

  return {
    snappedX,
    snappedY,
    guides,
  };
}

/**
 * Tính toán tọa độ hít (Snap) và danh sách đường gióng khi CO GIÃN (Resize) phần tử
 */
export function calculateResizeSnapAndGuides(
  proposedBounds: FieldResizeChange,
  handle: ResizeHandle,
  otherFields: CanvasField[],
  canvasSize: { width: number; height: number },
  sourceFieldId?: string,
  threshold = SNAP_THRESHOLD,
  margins?: MarginBounds,
): ResizeSnapResult {
  const { targetXLines, targetYLines } = getTargetGuideLines(
    otherFields,
    canvasSize,
    sourceFieldId,
    margins,
  );

  let newX = proposedBounds.position.x;
  let newY = proposedBounds.position.y;
  let newWidth = proposedBounds.size.width;
  let newHeight = proposedBounds.size.height;
  let activeGuideX: number | null = null;
  let activeGuideY: number | null = null;

  // Hít theo trục ngang X (chỉ tác động lên mép đang được kéo)
  if (handle === "e" || handle === "ne" || handle === "se") {
    const currentRight = proposedBounds.position.x + proposedBounds.size.width;
    let minDelta = threshold + 1;
    for (const targetX of targetXLines) {
      const delta = targetX - currentRight;
      if (Math.abs(delta) <= threshold && Math.abs(delta) < minDelta) {
        minDelta = Math.abs(delta);
        newWidth = Math.max(MIN_FIELD_SIZE, proposedBounds.size.width + delta);
        activeGuideX = targetX;
      }
    }
  } else if (handle === "w" || handle === "nw" || handle === "sw") {
    const currentLeft = proposedBounds.position.x;
    const fixedRight = proposedBounds.position.x + proposedBounds.size.width;
    let minDelta = threshold + 1;
    for (const targetX of targetXLines) {
      const delta = targetX - currentLeft;
      if (Math.abs(delta) <= threshold && Math.abs(delta) < minDelta) {
        minDelta = Math.abs(delta);
        const snappedLeft = proposedBounds.position.x + delta;
        newWidth = Math.max(MIN_FIELD_SIZE, fixedRight - snappedLeft);
        newX = fixedRight - newWidth;
        activeGuideX = targetX;
      }
    }
  }

  // Hít theo trục dọc Y (chỉ tác động lên mép đang được kéo)
  if (handle === "s" || handle === "se" || handle === "sw") {
    const currentBottom = proposedBounds.position.y + proposedBounds.size.height;
    let minDelta = threshold + 1;
    for (const targetY of targetYLines) {
      const delta = targetY - currentBottom;
      if (Math.abs(delta) <= threshold && Math.abs(delta) < minDelta) {
        minDelta = Math.abs(delta);
        newHeight = Math.max(MIN_FIELD_SIZE, proposedBounds.size.height + delta);
        activeGuideY = targetY;
      }
    }
  } else if (handle === "n" || handle === "ne" || handle === "nw") {
    const currentTop = proposedBounds.position.y;
    const fixedBottom = proposedBounds.position.y + proposedBounds.size.height;
    let minDelta = threshold + 1;
    for (const targetY of targetYLines) {
      const delta = targetY - currentTop;
      if (Math.abs(delta) <= threshold && Math.abs(delta) < minDelta) {
        minDelta = Math.abs(delta);
        const snappedTop = proposedBounds.position.y + delta;
        newHeight = Math.max(MIN_FIELD_SIZE, fixedBottom - snappedTop);
        newY = fixedBottom - newHeight;
        activeGuideY = targetY;
      }
    }
  }

  const guides: AlignmentGuide[] = [];
  if (activeGuideX !== null) {
    guides.push({ type: "vertical", position: activeGuideX });
  }
  if (activeGuideY !== null) {
    guides.push({ type: "horizontal", position: activeGuideY });
  }

  return {
    bounds: {
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight },
    },
    guides,
  };
}
