import type { FieldType } from "../../types/formBuilder.types";
import { HORIZONTAL_RESIZE_TYPES } from "../constants/resizableFieldTypes";
import type { ResizeHandle } from "../types/canvas.types";

const handlePositions: Record<ResizeHandle, string> = {
  nw: "-top-1 -left-1 cursor-nwse-resize",
  n: "-top-1 left-1/2 -translate-x-1/2 cursor-ns-resize",
  ne: "-top-1 -right-1 cursor-nesw-resize",
  e: "top-1/2 -right-1 -translate-y-1/2 cursor-ew-resize",
  se: "-bottom-1 -right-1 cursor-nwse-resize",
  s: "-bottom-1 left-1/2 -translate-x-1/2 cursor-ns-resize",
  sw: "-bottom-1 -left-1 cursor-nesw-resize",
  w: "top-1/2 -left-1 -translate-y-1/2 cursor-ew-resize",
};

type ResizeHandlesProps = {
  type: FieldType;
  onResizeStart: (handle: ResizeHandle, event: React.PointerEvent<HTMLSpanElement>) => void;
};

export function ResizeHandles({ type, onResizeStart }: ResizeHandlesProps) {
  const handles = HORIZONTAL_RESIZE_TYPES.includes(type)
    ? (["e", "w"] as ResizeHandle[])
    : (Object.keys(handlePositions) as ResizeHandle[]);

  return (
    <>
      {handles.map((handle) => (
        <span
          key={handle}
          data-resize-handle="true"
          className={`absolute z-10 h-1.5 w-1.5 rounded-none border border-blue-600 bg-blue-600 ${handlePositions[handle]}`}
          onPointerDownCapture={(event) => onResizeStart(handle, event)}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.stopPropagation()}
        />
      ))}
    </>
  );
}
