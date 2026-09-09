import type React from "react";
import {
  AlignLeft,
  Calendar,
  CircleDot,
  Hash,
  Image as ImageIcon,
  ListCollapse,
  QrCode,
  Signature,
  SquareCheck,
  Table,
  Text,
  Type,
} from "lucide-react";
import type { FieldType } from "../types/formBuilder.types";

export const PALETTE_ITEM_CENTER = { x: 42, y: 25 } as const;

export type FieldResizeMode = "8-way" | "horizontal" | "none";

export type FieldDefinition = {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  resizeMode: FieldResizeMode;
  defaultSize?: { width: number; height: number };
};

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    type: "text",
    label: "Văn bản",
    icon: <Text />,
    resizeMode: "horizontal",
    defaultSize: { width: 260, height: 24 },
  },
  {
    type: "textarea",
    label: "Đoạn văn",
    icon: <AlignLeft />,
    resizeMode: "8-way",
    defaultSize: { width: 360, height: 120 },
  },
  {
    type: "number",
    label: "Số",
    icon: <Hash />,
    resizeMode: "horizontal",
    defaultSize: { width: 200, height: 24 },
  },
  {
    type: "date",
    label: "Ngày",
    icon: <Calendar />,
    resizeMode: "horizontal",
    defaultSize: { width: 300, height: 24 },
  },
  {
    type: "select",
    label: "Danh sách",
    icon: <ListCollapse />,
    resizeMode: "horizontal",
    defaultSize: { width: 220, height: 24 },
  },
  {
    type: "radio",
    label: "Nút chọn",
    icon: <CircleDot />,
    resizeMode: "none",
    defaultSize: { width: 90, height: 24 },
  },
  {
    type: "checkbox",
    label: "Hộp kiểm",
    icon: <SquareCheck />,
    resizeMode: "none",
    defaultSize: { width: 90, height: 24 },
  },
  {
    type: "label",
    label: "Nhãn",
    icon: <Type />,
    resizeMode: "8-way",
    defaultSize: { width: 160, height: 40 },
  },
  {
    type: "signature",
    label: "Chữ ký",
    icon: <Signature />,
    resizeMode: "8-way",
    defaultSize: { width: 130, height: 140 },
  },
  {
    type: "qrcode",
    label: "Mã QR",
    icon: <QrCode />,
    resizeMode: "8-way",
    defaultSize: { width: 180, height: 180 },
  },
  {
    type: "image",
    label: "Hình ảnh",
    icon: <ImageIcon />,
    resizeMode: "8-way",
    defaultSize: { width: 360, height: 220 },
  },
  {
    type: "datatable",
    label: "Bảng dữ liệu",
    icon: <Table />,
    resizeMode: "8-way",
    defaultSize: { width: 440, height: 70 },
  },
];

/**
 * Bản đồ tra cứu nhanh FieldDefinition theo FieldType (O(1) lookup).
 */
export const FIELD_DEFINITIONS_MAP: Record<FieldType, FieldDefinition> =
  FIELD_DEFINITIONS.reduce(
    (acc, field) => {
      acc[field.type] = field;
      return acc;
    },
    {} as Record<FieldType, FieldDefinition>,
  );
