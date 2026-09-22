import type { JSONContent } from "@tiptap/react";

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

export type TextFieldData = {
  label: string;
  value?: string;
  placeholder?: string;
};

export type NumberFieldData = {
  label: string;
  value?: number;
  placeholder?: string;
  min?: number;
  max?: number;
};

export type SelectFieldData = {
  label: string;
  options: string[];
  value?: string;
};

export type DateFieldData = {
  label: string; // Địa danh
  value?: string; // Chuỗi định dạng ngày dd/mm/yyyy hoặc yyyy-mm-dd
};

export type LabelFieldData = {
  value: string;
};

export type CheckboxFieldData = {
  label: string;
  checked: boolean;
};

export type LineFieldData = Record<string, never>;

export type QrCodeFieldData = {
  value: string;
};

export type TextareaFieldData = {
  content?: JSONContent;
  html?: string;
};

export type SignatureFieldData = {
  label: string;
  subTitle?: string;
  signerName?: string;
  value?: string;
};

export type ImageFieldData = {
  value?: string;
};

export type DatatableFieldData = {
  content?: JSONContent;
  html?: string;
};

export type FieldDataMap = {
  text: TextFieldData;
  number: NumberFieldData;
  select: SelectFieldData;
  date: DateFieldData;
  label: LabelFieldData;
  checkbox: CheckboxFieldData;
  line: LineFieldData;
  qrcode: QrCodeFieldData;
  textarea: TextareaFieldData;
  signature: SignatureFieldData;
  image: ImageFieldData;
  datatable: DatatableFieldData;
};

export type FieldData = FieldDataMap[FieldType];

export type BaseCanvasField<T extends FieldType = FieldType> = {
  id: string;
  type: T;
  x: number;
  y: number;
  width?: number;
  height?: number;
  style?: FieldStyle;
  data?: FieldDataMap[T];
};

export type CanvasField = {
  [K in FieldType]: BaseCanvasField<K>;
}[FieldType];



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

// Cấu trúc object sẽ lưu vào db kiểu json
export interface FormSchemaJson {
  page: {
    preset: string;
    orientation: Orientation;
    margins: PageMargins;
    dimensions: PageSize;
  };
  fields: CanvasField[];
}
