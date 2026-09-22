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
import type { FieldDataMap, FieldType } from "../types/formBuilder.types";
import { DEFAULT_FIELD_DATA } from "./defaultFieldData";

export const PALETTE_ITEM_CENTER = { x: 42, y: 25 } as const;

export type FieldResizeMode = "8-way" | "horizontal" | "none";

export type FieldDefinition<T extends FieldType = FieldType> = {
  type: T;
  label: string;
  icon: React.ReactNode;
  resizeMode: FieldResizeMode;
  defaultSize?: { width: number; height: number };
  defaultData: FieldDataMap[T];
};


// Ép kiểu chính xác 1-1 giữa type field và defaultData tương ứng, tránh việc khai báo nhầm dữ liệu giữa các field
export type AnyFieldDefinition = {
  [K in FieldType]: FieldDefinition<K>;
}[FieldType];

export const FIELD_DEFINITIONS: AnyFieldDefinition[] = [
  {
    type: "text",
    label: "Văn bản",
    icon: <Text />,
    resizeMode: "horizontal",
    defaultSize: { width: 260, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.text,
  },
  {
    type: "textarea",
    label: "Đoạn văn",
    icon: <AlignLeft />,
    resizeMode: "8-way",
    defaultSize: { width: 360, height: 120 },
    defaultData: DEFAULT_FIELD_DATA.textarea,
  },
  {
    type: "number",
    label: "Số",
    icon: <Hash />,
    resizeMode: "horizontal",
    defaultSize: { width: 200, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.number,
  },
  {
    type: "date",
    label: "Ngày",
    icon: <Calendar />,
    resizeMode: "horizontal",
    defaultSize: { width: 300, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.date,
  },
  {
    type: "select",
    label: "Danh sách",
    icon: <ListCollapse />,
    resizeMode: "horizontal",
    defaultSize: { width: 220, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.select,
  },
  {
    type: "line",
    label: "Đường kẻ",
    icon: <Minus />,
    resizeMode: "horizontal",
    defaultSize: { width: 200, height: 1 },
    defaultData: DEFAULT_FIELD_DATA.line,
  },
  {
    type: "checkbox",
    label: "Hộp kiểm",
    icon: <SquareCheck />,
    resizeMode: "none",
    defaultSize: { width: 90, height: 24 },
    defaultData: DEFAULT_FIELD_DATA.checkbox,
  },
  {
    type: "label",
    label: "Nhãn",
    icon: <Type />,
    resizeMode: "8-way",
    defaultSize: { width: 160, height: 40 },
    defaultData: DEFAULT_FIELD_DATA.label,
  },
  {
    type: "signature",
    label: "Chữ ký",
    icon: <Signature />,
    resizeMode: "8-way",
    defaultSize: { width: 130, height: 140 },
    defaultData: DEFAULT_FIELD_DATA.signature,
  },
  {
    type: "qrcode",
    label: "Mã QR",
    icon: <QrCode />,
    resizeMode: "8-way",
    defaultSize: { width: 100, height: 100 },
    defaultData: DEFAULT_FIELD_DATA.qrcode,
  },
  {
    type: "image",
    label: "Hình ảnh",
    icon: <ImageIcon />,
    resizeMode: "8-way",
    defaultSize: { width: 360, height: 220 },
    defaultData: DEFAULT_FIELD_DATA.image,
  },
  {
    type: "datatable",
    label: "Bảng dữ liệu",
    icon: <Table />,
    resizeMode: "8-way",
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
    acc[field.type] = field as any;
    return acc;
  }, {} as FieldDefinitionMap);
