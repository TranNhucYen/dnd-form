export type FieldType =
  | "label"
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "line"
  | "checkbox"
  | "signature"
  | "qrcode"
  | "image"
  | "datatable";

export interface FieldStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right" | "justify";
  color?: string;
  backgroundColor?: string;
}

export type CanvasField = {
  id: string;
  type: FieldType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  style?: FieldStyle;
};

export type PageSize = {
  width: number; // mm
  height: number; // mm
};

export type Orientation = "PORTRAIT" | "LANDSCAPE";

export interface PageMargins {
  top: string;
  bottom: string;
  left: string;
  right: string;
}