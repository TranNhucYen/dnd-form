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
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export type PageSizeOption = {
  id: PagePresetKey;
  label: string;
};

export const PAGE_SIZE_OPTIONS: readonly PageSizeOption[] = [
  { id: "A4", label: FORM_BUILDER_LABELS.toolbar.pageSizeA4 },
  { id: "A5", label: FORM_BUILDER_LABELS.toolbar.pageSizeA5 },
  { id: "A3", label: FORM_BUILDER_LABELS.toolbar.pageSizeA3 },
] as const;

export const FONT_OPTIONS = [
  { id: "Roboto", label: FORM_BUILDER_LABELS.toolbar.fonts.roboto },
  { id: "Inter", label: FORM_BUILDER_LABELS.toolbar.fonts.inter },
  { id: "Arial", label: FORM_BUILDER_LABELS.toolbar.fonts.arial },
  { id: "Times New Roman", label: FORM_BUILDER_LABELS.toolbar.fonts.timesNewRoman },
  { id: "Courier New", label: FORM_BUILDER_LABELS.toolbar.fonts.courierNew },
];

export const FONT_SIZE_OPTIONS = [10, 12, 13, 14, 16, 18, 20, 24, 28, 32];

export const MARGIN_OPTIONS = [10, 15, 20, 25, 30];

export const MARGIN_FIELDS = [
  { key: "top", label: FORM_BUILDER_LABELS.toolbar.margins.top },
  { key: "bottom", label: FORM_BUILDER_LABELS.toolbar.margins.bottom },
  { key: "left", label: FORM_BUILDER_LABELS.toolbar.margins.left },
  { key: "right", label: FORM_BUILDER_LABELS.toolbar.margins.right },
] as const;

export const TEXT_FORMAT_ITEMS = [
  { value: "bold", label: FORM_BUILDER_LABELS.formatting.bold, icon: Bold },
  { value: "italic", label: FORM_BUILDER_LABELS.formatting.italic, icon: Italic },
  { value: "underline", label: FORM_BUILDER_LABELS.formatting.underline, icon: Underline },
];

export const TEXT_ALIGN_ITEMS = [
  { value: "left", label: FORM_BUILDER_LABELS.formatting.alignLeft, icon: AlignLeft },
  { value: "center", label: FORM_BUILDER_LABELS.formatting.alignCenter, icon: AlignCenter },
  { value: "right", label: FORM_BUILDER_LABELS.formatting.alignRight, icon: AlignRight },
  { value: "justify", label: FORM_BUILDER_LABELS.formatting.alignJustify, icon: AlignJustify },
];
