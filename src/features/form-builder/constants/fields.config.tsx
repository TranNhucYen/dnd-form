import type React from "react";
import {
  AlignLeft,
  Calendar,
  Hash,
  Image as ImageIcon,
  ListCollapse,
  Minus,
  QrCode,
  Signature,
  SquareCheck,
  Table,
  Text,
  Type,
} from "lucide-react";
import type { FieldDataMap, FieldStyle, FieldType } from "../types/formBuilder.types";
import { DEFAULT_FIELD_DATA } from "./defaultFieldData";
import { FORM_BUILDER_LABELS } from "./labels";

export const PALETTE_ITEM_CENTER = { x: 42, y: 25 } as const;

export type FieldResizeMode = "8-way" | "horizontal" | "none";

export type FieldDefinition<T extends FieldType = FieldType> = {
  type: T;
  label: string;
  icon: React.ReactNode;
  resizeMode: FieldResizeMode;
  defaultSize: { width: number; height: number };
  defaultData: FieldDataMap[T];
  defaultStyle?: Partial<FieldStyle>;
};


// Ép kiểu chính xác 1-1 giữa type field và defaultData tương ứng, tránh việc khai báo nhầm dữ liệu giữa các field
export type AnyFieldDefinition = {
  [K in FieldType]: FieldDefinition<K>;
}[FieldType];

export const FIELD_DEFINITIONS: AnyFieldDefinition[] = [
  {
    type: "text",
    label: FORM_BUILDER_LABELS.palette.fields.text,
    icon: <Text />,
    resizeMode: "horizontal",
    defaultSize: { width: 260, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.text,
  },
  {
    type: "textarea",
    label: FORM_BUILDER_LABELS.palette.fields.textarea,
    icon: <AlignLeft />,
    resizeMode: "8-way",
    defaultSize: { width: 360, height: 120 },
    defaultData: DEFAULT_FIELD_DATA.textarea,
  },
  {
    type: "number",
    label: FORM_BUILDER_LABELS.palette.fields.number,
    icon: <Hash />,
    resizeMode: "horizontal",
    defaultSize: { width: 200, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.number,
  },
  {
    type: "date",
    label: FORM_BUILDER_LABELS.palette.fields.date,
    icon: <Calendar />,
    resizeMode: "horizontal",
    defaultSize: { width: 300, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.date,
  },
  {
    type: "select",
    label: FORM_BUILDER_LABELS.palette.fields.select,
    icon: <ListCollapse />,
    resizeMode: "horizontal",
    defaultSize: { width: 220, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.select,
  },
  {
    type: "line",
    label: FORM_BUILDER_LABELS.palette.fields.line,
    icon: <Minus />,
    resizeMode: "horizontal",
    defaultSize: { width: 200, height: 1 },
    defaultData: DEFAULT_FIELD_DATA.line,
  },
  {
    type: "checkbox",
    label: FORM_BUILDER_LABELS.palette.fields.checkbox,
    icon: <SquareCheck />,
    resizeMode: "none",
    defaultSize: { width: 90, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.checkbox,
  },
  {
    type: "label",
    label: FORM_BUILDER_LABELS.palette.fields.label,
    icon: <Type />,
    resizeMode: "8-way",
    defaultSize: { width: 160, height: 40 },
    defaultData: DEFAULT_FIELD_DATA.label,
  },
  {
    type: "signature",
    label: FORM_BUILDER_LABELS.palette.fields.signature,
    icon: <Signature />,
    resizeMode: "8-way",
    defaultSize: { width: 130, height: 140 },
    defaultData: DEFAULT_FIELD_DATA.signature,
    defaultStyle: {
      textAlign: "center",
      fontSize: "14",
      parts: {
        label: { fontWeight: "bold", fontStyle: "normal" },
        subTitle: { fontWeight: "normal", fontStyle: "italic" },
        value: { fontWeight: "bold", fontStyle: "normal" },
      },
    },
  },
  {
    type: "qrcode",
    label: FORM_BUILDER_LABELS.palette.fields.qrcode,
    icon: <QrCode />,
    resizeMode: "8-way",
    defaultSize: { width: 100, height: 100 },
    defaultData: DEFAULT_FIELD_DATA.qrcode,
  },
  {
    type: "image",
    label: FORM_BUILDER_LABELS.palette.fields.image,
    icon: <ImageIcon />,
    resizeMode: "8-way",
    defaultSize: { width: 360, height: 220 },
    defaultData: DEFAULT_FIELD_DATA.image,
  },
  {
    type: "datatable",
    label: FORM_BUILDER_LABELS.palette.fields.datatable,
    icon: <Table />,
    resizeMode: "horizontal", // Chỉ cho phép kéo dãn chiều ngang, chiều cao tự điều chỉnh theo số hàng
    defaultSize: { width: 440, height: 70 },
    defaultData: DEFAULT_FIELD_DATA.datatable,
  },
];

export type FieldDefinitionMap = {
  [K in FieldType]: FieldDefinition<K>;
};

/**
 * Bản đồ tra cứu nhanh FieldDefinition theo FieldType (O(1) lookup).
 */
export const FIELD_DEFINITIONS_MAP: FieldDefinitionMap =
  FIELD_DEFINITIONS.reduce((acc, field) => {
    (acc as Record<FieldType, AnyFieldDefinition>)[field.type] = field;
    return acc;
  }, {} as FieldDefinitionMap);

