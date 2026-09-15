import type { FieldType } from "../types/formBuilder.types";

export interface PaletteDragData {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

export interface CanvasDragData {
  fieldId: string;
  type: FieldType;
  width?: number;
  height?: number;
}

export type FormBuilderDragData = PaletteDragData | CanvasDragData;
