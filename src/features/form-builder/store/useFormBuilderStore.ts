import { create } from "zustand";
import { FIELD_DEFINITIONS_MAP } from "../constants/fields.config";
import { PAGE_PRESETS } from "../constants/form.constants";
import type { FieldResizeChange } from "../canvas/types/canvas.types";
import type {
  CanvasField,
  FieldData,
  FieldStyle,
  FieldType,
  FormBuilderSnapshot,
  FormSchemaJson,
  Orientation,
  PageMargins,
  PagePresetKey,
  PageSize,
} from "../types/formBuilder.types";

export type { PagePresetKey };

export interface HistoryOptions {
  skipHistory?: boolean;
}

export const MAX_HISTORY_STEPS = 50;

export interface FormBuilderState {
  // Cấu hình trang in (Page Settings)
  pageSizePreset: PagePresetKey;
  orientation: Orientation;
  margins: PageMargins;

  // Danh sách phần tử và tương tác trên Canvas
  fields: CanvasField[];
  selectedFieldId: string | null;
  clipboardField: CanvasField | null;

  // Quản lý Lịch sử (Undo / Redo History)
  past: FormBuilderSnapshot[];
  future: FormBuilderSnapshot[];
  canUndo: boolean;
  canRedo: boolean;

  // Actions quản lý lịch sử
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  recordHistory: (customSelectedId?: string | null) => void;

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
  /** Cập nhật dữ liệu nội dung của phần tử (label, placeholder, value,...) */
  updateFieldData: (
    fieldId: string,
    data: Partial<FieldData>,
    options?: HistoryOptions,
  ) => void;
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

  /** Trích xuất schema snapshot hiện tại của Form */
  getFormSchema: () => FormSchemaJson;
}


export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
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

  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  recordHistory: (customSelectedId) => {
    const state = get();
    const currentSnapshot: FormBuilderSnapshot = {
      fields: structuredClone(state.fields),
      selectedFieldId:
        customSelectedId !== undefined
          ? customSelectedId
          : state.selectedFieldId,
    };

    // No-Op Guard: Kiểm tra nếu snapshot mới không khác gì snapshot trên đỉnh past
    const lastSnapshot = state.past[state.past.length - 1];
    if (lastSnapshot) {
      if (
        lastSnapshot.fields.length === currentSnapshot.fields.length &&
        JSON.stringify(lastSnapshot.fields) ===
          JSON.stringify(currentSnapshot.fields)
      ) {
        return;
      }
    }

    const newPast = [
      ...state.past.slice(-(MAX_HISTORY_STEPS - 1)),
      currentSnapshot,
    ];
    set({
      past: newPast,
      future: [],
      canUndo: true,
      canRedo: false,
    });
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;

    const previousSnapshot = past[past.length - 1];
    const newPast = past.slice(0, -1);

    const currentSnapshot: FormBuilderSnapshot = {
      fields: structuredClone(get().fields),
      selectedFieldId: get().selectedFieldId,
    };

    const targetSelectedId = previousSnapshot.selectedFieldId;
    const isValidSelection = Boolean(
      targetSelectedId &&
        previousSnapshot.fields.some((f) => f.id === targetSelectedId),
    );

    set({
      fields: structuredClone(previousSnapshot.fields),
      selectedFieldId: isValidSelection ? targetSelectedId : null,
      past: newPast,
      future: [currentSnapshot, ...future].slice(0, MAX_HISTORY_STEPS),
      canUndo: newPast.length > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;

    const nextSnapshot = future[0];
    const newFuture = future.slice(1);

    const currentSnapshot: FormBuilderSnapshot = {
      fields: structuredClone(get().fields),
      selectedFieldId: get().selectedFieldId,
    };

    const targetSelectedId = nextSnapshot.selectedFieldId;
    const isValidSelection = Boolean(
      targetSelectedId &&
        nextSnapshot.fields.some((f) => f.id === targetSelectedId),
    );

    const newPast = [...past.slice(-(MAX_HISTORY_STEPS - 1)), currentSnapshot];

    set({
      fields: structuredClone(nextSnapshot.fields),
      selectedFieldId: isValidSelection ? targetSelectedId : null,
      past: newPast,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
  },

  clearHistory: () =>
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),

  setPageSizePreset: (preset) => set({ pageSizePreset: preset }),

  setOrientation: (orientation) => set({ orientation }),

  setMargins: (margins) =>
    set((state) => ({
      margins: { ...state.margins, ...margins },
    })),

  setMarginValue: (key, value) =>
    set((state) => ({
      margins: { ...state.margins, [key]: value },
    })),

  setSelectedFieldId: (id) => set({ selectedFieldId: id }),

  selectAllFields: () => { },

  addField: (type, coordinates) => {
    get().recordHistory();
    const def = FIELD_DEFINITIONS_MAP[type];
    const newField: CanvasField = {
      id: globalThis.crypto.randomUUID(),
      type,
      ...coordinates,
      width: def?.defaultSize?.width,
      height: def?.defaultSize?.height,
      data: def?.defaultData ? structuredClone(def.defaultData) : undefined,
    } as CanvasField;

    set((state) => ({
      fields: [...state.fields, newField],
      selectedFieldId: newField.id,
    }));
  },

  updateFieldPosition: (fieldId, coordinates) => {
    get().recordHistory();
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === fieldId ? { ...field, ...coordinates } : field,
      ),
    }));
  },

  updateFieldStyle: (fieldId, style) => {
    get().recordHistory();
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
    }));
  },

  updateFieldData: (fieldId, data, options) => {
    if (!options?.skipHistory) {
      get().recordHistory();
    }
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === fieldId
          ? ({
            ...field,
            data: {
              ...field.data,
              ...data,
            },
          } as CanvasField)
          : field,
      ),
    }));
  },

  updateFieldResize: (fieldId, change) => {
    get().recordHistory();
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
    }));
  },

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

  removeField: (fieldId) => {
    get().recordHistory();
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== fieldId),
      selectedFieldId:
        state.selectedFieldId === fieldId ? null : state.selectedFieldId,
    }));
  },

  duplicateField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    if (!target) {
      return;
    }
    get().recordHistory();
    const duplicatedField: CanvasField = {
      ...target,
      id: globalThis.crypto.randomUUID(),
      x: target.x + 10,
      y: target.y + 10,
      data: target.data ? structuredClone(target.data) : undefined,
    } as CanvasField;

    set((state) => ({
      fields: [...state.fields, duplicatedField],
      selectedFieldId: duplicatedField.id,
    }));
  },

  copyField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    return target ? { clipboardField: { ...target } } : get();
  },

  cutField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    if (!target) {
      return;
    }
    get().recordHistory();
    set((state) => ({
      clipboardField: { ...target },
      fields: state.fields.filter((field) => field.id !== fieldId),
      selectedFieldId:
        state.selectedFieldId === fieldId ? null : state.selectedFieldId,
    }));
  },

  pasteField: (offset = { x: 10, y: 10 }) => {
    const { clipboardField } = get();
    if (!clipboardField) {
      return;
    }
    get().recordHistory();
    const pastedField: CanvasField = {
      ...clipboardField,
      id: globalThis.crypto.randomUUID(),
      x: clipboardField.x + offset.x,
      y: clipboardField.y + offset.y,
      data: clipboardField.data
        ? structuredClone(clipboardField.data)
        : undefined,
    } as CanvasField;

    set((state) => ({
      fields: [...state.fields, pastedField],
      selectedFieldId: pastedField.id,
    }));
  },

  getFormSchema: () => {
    const state = get();
    return {
      page: {
        preset: state.pageSizePreset,
        orientation: state.orientation,
        margins: state.margins,
        dimensions: getEffectivePageDimensions(
          state.pageSizePreset,
          state.orientation,
        ),
      },
      fields: state.fields,
    };
  },
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
