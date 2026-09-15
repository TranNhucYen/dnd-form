export type { CanvasField, FieldType } from "../../types/formBuilder.types";

export type FieldResizeChange = {
  position: { x: number; y: number };
  size: { width: number; height: number };
};

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export type MarginBounds = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};
