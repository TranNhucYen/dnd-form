import { create } from "zustand";
import { FIELD_DEFINITIONS_MAP } from "../constants/fields.config";
import { PAGE_PRESETS } from "../constants/form.constants";
import type { FieldResizeChange } from "../canvas/types/canvas.types";
import type {
  CanvasField,
  FieldStyle,
  FieldType,
  Orientation,
  PageMargins,
  PageSize,
} from "../types/formBuilder.types";

export type PagePresetKey = keyof typeof PAGE_PRESETS;

export interface FormBuilderState {
  // Cấu hình trang in (Page Settings)
  pageSizePreset: PagePresetKey;
  orientation: Orientation;
  margins: PageMargins;

  // Danh sách phần tử và tương tác trên Canvas
  fields: CanvasField[];
  selectedFieldId: string | null;
  clipboardField: CanvasField | null;

  // Actions cấu hình trang
  setPageSizePreset: (preset: PagePresetKey) => void;
  setOrientation: (orientation: Orientation) => void;
  setMargins: (margins: Partial<PageMargins>) => void;
  setMarginValue: (key: keyof PageMargins, value: string) => void;

  // Actions phần tử Form
  setSelectedFieldId: (id: string | null) => void;
  selectAllFields: () => void;
  addField: (type: FieldType, coordinates: { x: number; y: number }) => void;
  updateFieldPosition: (fieldId: string, coordinates: { x: number; y: number }) => void;
  /** Cập nhật font, cỡ chữ, căn lề, màu sắc cho phần tử */
  updateFieldStyle: (fieldId: string, style: Partial<FieldStyle>) => void;
  /** Cập nhật x,y và width,height mới sau khi hoàn tất thao tác resize */
  updateFieldResize: (fieldId: string, change: FieldResizeChange) => void;
  /** Tự động đo và lưu kích thước DOM thực tế lần đầu tiên cho các phần tử co giãn theo nội dung */
  measureField: (
    fieldId: string,
    size: { width: number; height: number },
  ) => void;
  removeField: (fieldId: string) => void;
  duplicateField: (fieldId: string) => void;
  copyField: (fieldId: string) => void;
  cutField: (fieldId: string) => void;
  pasteField: (offset?: { x: number; y: number }) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  pageSizePreset: "A4",
  orientation: "PORTRAIT",
  margins: {
    top: "20",
    bottom: "20",
    left: "20",
    right: "20",
  },

  fields: [],
  selectedFieldId: null,
  clipboardField: null,

  setPageSizePreset: (preset) => set({ pageSizePreset: preset }),

  setOrientation: (orientation) => set({ orientation }),

  setMargins: (newMargins) =>
    set((state) => ({
      margins: { ...state.margins, ...newMargins },
    })),

  setMarginValue: (key, value) =>
    set((state) => ({
      margins: { ...state.margins, [key]: value },
    })),

  setSelectedFieldId: (id) => set({ selectedFieldId: id }),

  selectAllFields: () => {},

  addField: (type, coordinates) => {
    const defaultSize = FIELD_DEFINITIONS_MAP[type]?.defaultSize;
    const newField: CanvasField = {
      id: globalThis.crypto.randomUUID(),
      type,
      ...coordinates,
      width: defaultSize?.width,
      height: defaultSize?.height,
    };

    set((state) => ({
      fields: [...state.fields, newField],
      selectedFieldId: newField.id,
    }));
  },

  updateFieldPosition: (fieldId, coordinates) =>
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === fieldId ? { ...field, ...coordinates } : field,
      ),
    })),

  updateFieldStyle: (fieldId, style) =>
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              style: {
                ...field.style,
                ...style,
              },
            }
          : field,
      ),
    })),

  updateFieldResize: (fieldId, change) =>
    set((state) => ({
      fields: state.fields.map((item) =>
        item.id === fieldId
          ? {
            ...item,
            x: change.position.x,
            y: change.position.y,
            ...change.size,
          }
          : item,
      ),
    })),

  measureField: (fieldId, size) =>
    set((state) => {
      const currentField = state.fields.find((item) => item.id === fieldId);
      if (
        !currentField ||
        (currentField.width !== undefined && currentField.height !== undefined)
      ) {
        return state;
      }

      return {
        fields: state.fields.map((item) =>
          item.id === fieldId ? { ...item, ...size } : item,
        ),
      };
    }),

  removeField: (fieldId) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== fieldId),
      selectedFieldId:
        state.selectedFieldId === fieldId ? null : state.selectedFieldId,
    })),

  duplicateField: (fieldId) =>
    set((state) => {
      const target = state.fields.find((field) => field.id === fieldId);
      if (!target) {
        return state;
      }

      const duplicatedField: CanvasField = {
        ...target,
        id: globalThis.crypto.randomUUID(),
        x: target.x + 10,
        y: target.y + 10,
      };

      return {
        fields: [...state.fields, duplicatedField],
        selectedFieldId: duplicatedField.id,
      };
    }),

  copyField: (fieldId) =>
    set((state) => {
      const target = state.fields.find((field) => field.id === fieldId);
      return target ? { clipboardField: { ...target } } : state;
    }),

  cutField: (fieldId) =>
    set((state) => {
      const target = state.fields.find((field) => field.id === fieldId);
      if (!target) {
        return state;
      }

      return {
        clipboardField: { ...target },
        fields: state.fields.filter((field) => field.id !== fieldId),
        selectedFieldId:
          state.selectedFieldId === fieldId ? null : state.selectedFieldId,
      };
    }),

  pasteField: (offset = { x: 10, y: 10 }) =>
    set((state) => {
      if (!state.clipboardField) {
        return state;
      }

      const pastedField: CanvasField = {
        ...state.clipboardField,
        id: globalThis.crypto.randomUUID(),
        x: state.clipboardField.x + offset.x,
        y: state.clipboardField.y + offset.y,
      };

      return {
        fields: [...state.fields, pastedField],
        selectedFieldId: pastedField.id,
      };
    }),
}));

/**
 * Helper: Tính toán lại kích thước page bằng cách đảo ngược giá trị width và height dựa trên orientation
 */
export function getEffectivePageDimensions(
  pageSizePreset: PagePresetKey,
  orientation: Orientation,
): PageSize {
  const baseSize = PAGE_PRESETS[pageSizePreset] ?? PAGE_PRESETS.A4;

  if (orientation === "LANDSCAPE") {
    return {
      width: baseSize.height,
      height: baseSize.width,
    };
  }
  return {
    width: baseSize.width,
    height: baseSize.height,
  };
}

/**
 * Hook: Lấy kích thước trang in thực tế an toàn cho SSR / hydration (tránh tạo object mới)
 */
export function useEffectivePageDimensions(): PageSize {
  const pageSizePreset = useFormBuilderStore((state) => state.pageSizePreset);
  const orientation = useFormBuilderStore((state) => state.orientation);

  return getEffectivePageDimensions(pageSizePreset, orientation);
}
