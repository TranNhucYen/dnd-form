import type {
  FieldStyle,
  FieldType,
  SchemaField,
} from "@/features/form-builder/types/formBuilder.types";

export interface EFormTableCell {
  id: string;
  isHeader: boolean;
  colSpan: number;
  rowSpan: number;
  text: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    textAlign?: "left" | "center" | "right" | "justify";
  };
}

export interface EFormTableRow {
  id: string;
  cells: EFormTableCell[];
}

/**
 * Cấu trúc bảng sau khi bóc tách từ AST
 */
export interface EFormTableData {
  totalColumns: number;
  rows: EFormTableRow[];
}

/**
 * Node phần tử trong E-Form sau khi tính toán vị trí Grid
 */
export interface EFormElement {
  id: string;
  type: FieldType;
  rawField: SchemaField;
  colStart?: number;
  colSpan?: number;
  style?: FieldStyle;
}


export interface EFormRow {
  id: string;
  elements: EFormElement[];
}


export interface EFormPage {
  id: string;
  pageNumber: number;
  name?: string;
  rows: EFormRow[];
}

export interface EFormLayout {
  pages: EFormPage[];
  totalFields: number;
}
