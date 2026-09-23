import { useDroppable } from "@dnd-kit/react";
import { useMemo, useRef, useState } from "react";
import { toInternalUnit, toScreenPx } from "../domain/units";
import { FieldRenderer } from "../fields/FieldRenderer";
import { RESIZABLE_FIELD_TYPES } from "./constants/resizableFieldTypes";
import { FormFieldShell } from "./FormFieldShell";
import {
  useCanvasDragDrop,
  useCanvasFieldsState,
  useCanvasKeyboardShortcuts,
} from "./hooks";
import {
  CanvasContextMenu,
  MarginCornerMarks,
  SmartGuidesOverlay,
} from "./components";
import type { AlignmentGuide } from "./utils";
import {
  useEffectivePageDimensions,
  useFormBuilderStore,
} from "../store/useFormBuilderStore";

type FormCanvasProps = {
  onCollisionChange?: (isColliding: boolean) => void;
};

/**
 * FormCanvas: Vùng hiển thị trang in và chứa các phần tử kéo thả
 */
export function FormCanvas({ onCollisionChange }: FormCanvasProps) {
  useCanvasKeyboardShortcuts();

  const effectiveDimensions = useEffectivePageDimensions();
  const margins = useFormBuilderStore((state) => state.margins);
  const updateFieldData = useFormBuilderStore((state) => state.updateFieldData);

  const internalSize = {
    width: toInternalUnit(effectiveDimensions.width),
    height: toInternalUnit(effectiveDimensions.height),
  };
  const canvasStyle = {
    width: toScreenPx(internalSize.width),
    height: toScreenPx(internalSize.height),
  };

  const marginPx = useMemo(
    () => ({
      top: toScreenPx(toInternalUnit(Number.parseFloat(margins.top) || 0)),
      bottom: toScreenPx(toInternalUnit(Number.parseFloat(margins.bottom) || 0)),
      left: toScreenPx(toInternalUnit(Number.parseFloat(margins.left) || 0)),
      right: toScreenPx(toInternalUnit(Number.parseFloat(margins.right) || 0)),
    }),
    [margins.top, margins.bottom, margins.left, margins.right],
  );

  const pageRef = useRef<HTMLDivElement>(null);
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);

  const { ref: droppableRef } = useDroppable({
    id: "canvas",
  });

  const setCanvasRef = (element: HTMLDivElement | null) => {
    pageRef.current = element;
    droppableRef(element);
  };

  const {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    collidingFieldIds,
    setCollidingFieldIds,
    addField,
    updateFieldPosition,
    updateFieldResize,
    measureField,
  } = useCanvasFieldsState();

  useCanvasDragDrop({
    canvasRef: pageRef,
    canvasSize: { width: canvasStyle.width, height: canvasStyle.height },
    margins: marginPx,
    fields,
    onGuidesChange: setActiveGuides,
    onCollisionChange,
    setCollidingFieldIds,
    onDropPosition: updateFieldPosition,
    onDropNewField: addField,
  });

  return (
    <CanvasContextMenu>
      <div
        ref={setCanvasRef}
        data-droppable-id="canvas"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedFieldId(null);
          }
        }}
        className="relative flex bg-white shadow-md outline outline-1 outline-gray-300"
        style={{
          width: `${canvasStyle.width}px`,
          height: `${canvasStyle.height}px`,
        }}
      >
        {/* Lớp hiển thị đường gióng thông minh (Smart Guides) */}
        <SmartGuidesOverlay guides={activeGuides} />

        {/* Lớp hiển thị 4 góc vuông ranh giới lề trang (Margin Corner Marks) */}
        <MarginCornerMarks
          canvasWidth={canvasStyle.width}
          canvasHeight={canvasStyle.height}
        />

        {fields.map((field) => {
          const isResizable = RESIZABLE_FIELD_TYPES.includes(field.type);
          const hasMeasuredSize =
            field.width !== undefined && field.height !== undefined;

          return (
            <FormFieldShell
              key={field.id}
              id={field.id}
              type={field.type}
              position={{ x: field.x, y: field.y }}
              size={
                isResizable && hasMeasuredSize
                  ? { width: field.width!, height: field.height! }
                  : undefined
              }
              fieldStyle={field.style}
              fields={fields}
              canvasSize={{ width: canvasStyle.width, height: canvasStyle.height }}
              margins={marginPx}
              allowResize={isResizable}
              isColliding={collidingFieldIds.includes(field.id)}
              isSelected={selectedFieldId === field.id}
              onSelect={() => setSelectedFieldId(field.id)}
              onGuidesChange={setActiveGuides}
              onResize={(change) => updateFieldResize(field.id, change)}
              onCollisionChange={onCollisionChange}
              onCollidingFieldsChange={setCollidingFieldIds}
              onMeasure={
                isResizable
                  ? (size) => measureField(field.id, size)
                  : undefined
              }
            >
              <FieldRenderer
                type={field.type}
                id={field.id}
                width={field.width}
                height={field.height}
                data={field.data}
                onDataChange={(patch, options) =>
                  updateFieldData(field.id, patch, options)
                }
              />
            </FormFieldShell>
          );
        })}
      </div>
    </CanvasContextMenu>
  );
}