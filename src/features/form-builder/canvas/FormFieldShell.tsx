import { PointerSensor, useDraggable } from "@dnd-kit/react";
import { useEffectEvent, useMemo, useRef } from "react";
import type { FieldType } from "../types/formBuilder.types";
import type {
  CanvasField,
  FieldResizeChange,
  MarginBounds,
} from "./types/canvas.types";
import { useFieldResize } from "./hooks";
import { FieldContextMenu, ResizeHandles } from "./components";
import type { AlignmentGuide } from "./utils";

type FormFieldShellProps = {
  children: React.ReactNode;
  position: { x: number; y: number };
  id: string;
  type: FieldType;
  size?: { width: number; height: number };
  fields?: CanvasField[];
  canvasSize?: { width: number; height: number };
  margins?: MarginBounds;
  allowResize?: boolean;
  isColliding?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onGuidesChange?: (guides: AlignmentGuide[]) => void;
  onResize?: (change: FieldResizeChange) => void;
  onMeasure?: (size: { width: number; height: number }) => void;
  onCollisionChange?: (isColliding: boolean) => void;
  onCollidingFieldsChange?: (collidingIds: string[]) => void;
};

/**
 * FormFieldShell: Khung bao ngoài phần tử field trên Canvas
 */
export function FormFieldShell({
  children,
  position,
  id,
  type,
  size: controlledSize,
  fields,
  canvasSize,
  margins,
  allowResize = false,
  isColliding = false,
  isSelected = false,
  onSelect,
  onGuidesChange,
  onResize,
  onMeasure,
  onCollisionChange,
  onCollidingFieldsChange,
}: FormFieldShellProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);

  // Bỏ qua drag khi bấm vào resize handle hoặc khi đang ở chế độ gõ / bôi đen text
  const sensors = useMemo(
    () => [
      PointerSensor.configure({
        preventActivation: (event) => {
          const target = event.target;

          if (!(target instanceof Element)) {
            return false;
          }

          return (
            target.closest('[data-resize-handle="true"], [contenteditable="true"], input, textarea') !== null
          );
        },
      }),
    ],
    [],
  );

  const { ref, isDragging } = useDraggable({
    id: `field-${id}`,
    type,
    data: {
      fieldId: id,
      type,
      width: controlledSize?.width,
      height: controlledSize?.height,
    },
    sensors,
  });

  const setShellRef = (element: HTMLDivElement | null) => {
    shellRef.current = element;
    ref(element);
  };

  const handleClick = useEffectEvent((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSelect?.();
  });

  const { startResize } = useFieldResize({
    elementRef: shellRef,
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
  });

  return (
    <FieldContextMenu fieldId={id}>
      {/* field shell trên canvas */}
      <div
        ref={setShellRef}
        data-field-id={id}
        onClick={handleClick}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          visibility: isDragging ? "hidden" : "visible",
          outline: isColliding
            ? "1px dashed red"
            : isSelected
              ? "1px dashed #2563eb"
              : undefined,
          outlineOffset: "2px",
          width: controlledSize?.width,
          height: controlledSize?.height,
          boxSizing: "border-box",
        }}
      >
        <div className="h-full w-full">{children}</div>

        {allowResize && isSelected && !isDragging && (
          <ResizeHandles type={type} onResizeStart={startResize} />
        )}
      </div>
    </FieldContextMenu>
  );
}