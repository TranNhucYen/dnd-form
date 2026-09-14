import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import type { PagePresetKey } from "../../store/useFormBuilderStore";

export type PageSizeOption = {
  id: PagePresetKey;
  label: string;
};

export const PAGE_SIZE_OPTIONS: readonly PageSizeOption[] = [
  { id: "A4", label: "Khổ A4 (210 × 297 mm)" },
  { id: "A5", label: "Khổ A5 (148 × 210 mm)" },
  { id: "A3", label: "Khổ A3 (297 × 420 mm)" },
] as const;

export const FONT_OPTIONS = [
  { id: "Roboto", label: "Roboto" },
  { id: "Inter", label: "Inter" },
  { id: "Arial", label: "Arial" },
  { id: "Times New Roman", label: "Times New Roman" },
  { id: "Courier New", label: "Courier New" },
];

export const FONT_SIZE_OPTIONS = [10, 12, 13, 14, 16, 18, 20, 24, 28, 32];

export const MARGIN_OPTIONS = [10, 15, 20, 25, 30];

export const MARGIN_FIELDS = [
  { key: "top", label: "Trên" },
  { key: "bottom", label: "Dưới" },
  { key: "left", label: "Trái" },
  { key: "right", label: "Phải" },
] as const;

export const TEXT_FORMAT_ITEMS = [
  { value: "bold", label: "In đậm", icon: Bold },
  { value: "italic", label: "In nghiêng", icon: Italic },
  { value: "underline", label: "Gạch chân", icon: Underline },
];

export const TEXT_ALIGN_ITEMS = [
  { value: "left", label: "Căn trái", icon: AlignLeft },
  { value: "center", label: "Căn giữa", icon: AlignCenter },
  { value: "right", label: "Căn phải", icon: AlignRight },
  { value: "justify", label: "Căn đều", icon: AlignJustify },
];
