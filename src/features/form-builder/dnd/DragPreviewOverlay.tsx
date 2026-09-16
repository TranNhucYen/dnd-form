import { DragOverlay } from "@dnd-kit/react";
import type { FormBuilderDragData } from "./dragData.types";
import { FieldRenderer } from "../fields/FieldRenderer";
import { FIELD_DEFINITIONS_MAP, PALETTE_ITEM_CENTER } from "../constants/fields.config";

type DragPreviewOverlayProps = {
  isDraggingOverField: boolean;
};

/**
 * DragPreviewOverlay: Hiển thị overlay của filed di kéo field
 */
export function DragPreviewOverlay({
  isDraggingOverField,
}: DragPreviewOverlayProps) {
  return (
    <DragOverlay dropAnimation={null}>
      {(source) => {
        const data = source.data as FormBuilderDragData | undefined;

        if (!data) {
          return null;
        }

        const defaultSize = data.type ? FIELD_DEFINITIONS_MAP[data.type]?.defaultSize : undefined;
        const width = ("width" in data && data.width !== undefined) ? data.width : defaultSize?.width;
        const height = ("height" in data && data.height !== undefined) ? data.height : defaultSize?.height;
        const isFromPalette = source.id.toString().startsWith("palette-");

        // Khi kéo phần tử mới từ Palette: dịch chuyển để trọng tâm phần tử mới nằm ngay con trỏ chuột
        const shiftX = isFromPalette && width !== undefined ? PALETTE_ITEM_CENTER.x - width / 2 : 0;
        const shiftY = isFromPalette && height !== undefined ? PALETTE_ITEM_CENTER.y - height / 2 : 0;

        return (
          <div
            style={{
              width,
              height,
              transform:
                shiftX !== 0 || shiftY !== 0
                  ? `translate3d(${shiftX}px, ${shiftY}px, 0)`
                  : undefined,
              opacity: isFromPalette ? 0.6 : 1,
            }}
            className={`pointer-events-none ${width === undefined ? "w-max" : ""} overflow-hidden outline outline-1 outline-dashed ${
              isDraggingOverField ? "outline-red-500" : "outline-blue-500"
            }`}
          >
            <FieldRenderer type={data.type} width={width} height={height} />
          </div>
        );
      }}
    </DragOverlay>
  );
}
