import { DragOverlay } from "@dnd-kit/react";
import type { FormBuilderDragData } from "./dragData.types";
import { FieldRenderer } from "../fields/FieldRenderer";
import {
  FIELD_DEFINITIONS_MAP,
  PALETTE_ITEM_CENTER,
} from "../constants/fields.config";
import { RESIZABLE_FIELD_TYPES } from "../canvas/constants/resizableFieldTypes";
import { useFormBuilderStore } from "../store/useFormBuilderStore";
import type { FieldType } from "../types/formBuilder.types";

type DragPreviewOverlayProps = {
  isDraggingOverField: boolean;
};

/**
 * DragPreviewOverlay: Hiển thị overlay của field khi kéo thả
 */
export function DragPreviewOverlay({
  isDraggingOverField,
}: DragPreviewOverlayProps) {
  const fields = useFormBuilderStore((state) => state.fields);

  return (
    <DragOverlay dropAnimation={null}>
      {(source) => {
        const data = source.data as FormBuilderDragData | undefined;

        if (!data) {
          return null;
        }

        // Trong hệ thống, phần tử trên canvas luôn có fieldId, còn kéo từ Palette thì không có fieldId
        const isFromPalette = !("fieldId" in data);
        const canvasField = !isFromPalette
          ? fields.find((f) => f.id === data.fieldId)
          : undefined;

        const fieldType = (canvasField?.type ?? data.type) as FieldType;
        const isResizable = RESIZABLE_FIELD_TYPES.includes(fieldType);

        const defaultSize = fieldType
          ? FIELD_DEFINITIONS_MAP[fieldType]?.defaultSize
          : undefined;
        const defaultData = fieldType
          ? FIELD_DEFINITIONS_MAP[fieldType]?.defaultData
          : undefined;

        // Đối với field không cho resize (như checkbox), kích thước theo nội dung (undefined -> w-max)
        // Đối với field resizable, lấy kích thước thực tế từ canvas hoặc defaultSize nếu kéo từ palette
        const width = isResizable
          ? (canvasField?.width ?? data.width ?? defaultSize?.width)
          : undefined;

        const height = isResizable
          ? (canvasField?.height ?? data.height ?? defaultSize?.height)
          : undefined;

        // Nội dung và style được lấy trực tiếp từ field thực tế trên canvas
        const fieldData = canvasField?.data ?? defaultData;
        const fieldStyle = canvasField?.style;

        // Khi kéo phần tử mới từ Palette: dịch chuyển để trọng tâm phần tử mới nằm ngay con trỏ chuột
        const effectiveWidth = width ?? defaultSize?.width;
        const effectiveHeight = height ?? defaultSize?.height;
        const shiftX =
          isFromPalette && effectiveWidth !== undefined
            ? PALETTE_ITEM_CENTER.x - effectiveWidth / 2
            : 0;
        const shiftY =
          isFromPalette && effectiveHeight !== undefined
            ? PALETTE_ITEM_CENTER.y - effectiveHeight / 2
            : 0;

        return (
          <div
            style={{
              width,
              height,
              boxSizing: "border-box",
              backgroundColor: fieldStyle?.backgroundColor || "white",
              transform:
                shiftX !== 0 || shiftY !== 0
                  ? `translate3d(${shiftX}px, ${shiftY}px, 0)`
                  : undefined,
              opacity: isFromPalette ? 0.6 : 1,
            }}
            className={`pointer-events-none ${width === undefined ? "w-max" : ""} overflow-hidden outline outline-1 outline-dashed outline-offset-2 ${
              isDraggingOverField ? "outline-red-500" : "outline-blue-500"
            }`}
          >
            <div
              className="h-full w-full"
              style={{
                fontFamily: fieldStyle?.fontFamily || "Times New Roman",
                fontSize: fieldStyle?.fontSize
                  ? `${fieldStyle.fontSize}px`
                  : undefined,
                fontWeight: fieldStyle?.fontWeight,
                fontStyle: fieldStyle?.fontStyle,
                textDecoration: fieldStyle?.textDecoration,
                textAlign: fieldStyle?.textAlign,
                color: fieldStyle?.color,
                backgroundColor: fieldStyle?.backgroundColor,
              }}
            >
              <FieldRenderer
                type={fieldType}
                id={canvasField ? `drag-preview-${canvasField.id}` : undefined}
                width={width}
                height={height}
                data={fieldData}
              />
            </div>
          </div>
        );
      }}
    </DragOverlay>
  );
}
