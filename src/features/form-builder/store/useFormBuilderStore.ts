import { create } from "zustand";
import { FIELD_DEFINITIONS_MAP } from "../constants/fields.config";
import { PAGE_PRESETS } from "../constants/form.constants";
import {
  exportFormSchema,
  importSchemaPageToCanvasPage,
} from "../domain/transformers";
import type { FieldResizeChange } from "../canvas/types/canvas.types";
import type {
  CanvasField,
  CanvasPage,
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

function createDefaultBlankPage(pageNumber: number = 1, id?: string): CanvasPage {
  return {
    id: id || `page_${Math.random().toString(36).substring(2, 9)}`,
    pageNumber,
    name: `Trang ${pageNumber}`,
    pageSizePreset: "A4",
    orientation: "PORTRAIT",
    margins: {
      top: "20",
      bottom: "20",
      left: "20",
      right: "20",
    },
    fields: [],
  };
}

function updateActivePageFields(
  pages: CanvasPage[],
  activePageId: string,
  newFields: CanvasField[],
): CanvasPage[] {
  return pages.map((page) =>
    page.id === activePageId ? { ...page, fields: newFields } : page,
  );
}

export interface FormBuilderState {
  // Danh sách các trang in (Multi-Page)
  pages: CanvasPage[];
  activePageId: string;

  // Cấu hình và dữ liệu của trang đang active (đồng bộ 2 chiều với activePage trong pages)
  pageSizePreset: PagePresetKey;
  orientation: Orientation;
  margins: PageMargins;
  fields: CanvasField[];

  // Tương tác phần tử trên Canvas
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

  // Actions quản lý trang
  addPage: () => void;
  removePage: (pageId: string) => void;
  setActivePageId: (pageId: string) => void;

  // Actions cấu hình trang active
  setPageSizePreset: (preset: PagePresetKey) => void;
  setOrientation: (orientation: Orientation) => void;
  setMargins: (margins: Partial<PageMargins>) => void;
  setMarginValue: (key: keyof PageMargins, value: string) => void;

  // Actions phần tử Form trên trang active
  setSelectedFieldId: (id: string | null) => void;
  selectAllFields: () => void;
  addField: (type: FieldType, coordinates: { x: number; y: number }) => void;
  updateFieldPosition: (fieldId: string, coordinates: { x: number; y: number }) => void;
  updateFieldStyle: (fieldId: string, style: Partial<FieldStyle>) => void;
  updateFieldData: (
    fieldId: string,
    data: Partial<FieldData>,
    options?: HistoryOptions,
  ) => void;
  updateFieldResize: (fieldId: string, change: FieldResizeChange) => void;
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

  // Adapter lưu trữ và giao tiếp với Host App
  onSave?: (schema: FormSchemaJson) => Promise<void> | void;
  setOnSave: (
    handler?: (schema: FormSchemaJson) => Promise<void> | void,
  ) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  triggerSave: () => Promise<void>;

  /** Trạng thái chỉ xem của biểu mẫu */
  isReadOnly: boolean;
  setIsReadOnly: (isReadOnly: boolean) => void;

  /** Nạp schema chuẩn hóa vào Canvas */
  loadFormSchema: (schema: FormSchemaJson) => void;

  /** Đặt lại Canvas về trạng thái ban đầu */
  resetForm: () => void;
}

const initialDefaultPage = createDefaultBlankPage(1, "page_initial");

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  pages: [initialDefaultPage],
  activePageId: initialDefaultPage.id,

  pageSizePreset: initialDefaultPage.pageSizePreset,
  orientation: initialDefaultPage.orientation,
  margins: initialDefaultPage.margins,
  fields: initialDefaultPage.fields,

  selectedFieldId: null,
  clipboardField: null,

  isReadOnly: false,
  setIsReadOnly: (isReadOnly) => set({ isReadOnly }),

  onSave: undefined,
  isSaving: false,

  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  recordHistory: (customSelectedId) => {
    const state = get();
    const currentSnapshot: FormBuilderSnapshot = {
      pages: structuredClone(state.pages),
      activePageId: state.activePageId,
      selectedFieldId:
        customSelectedId !== undefined
          ? customSelectedId
          : state.selectedFieldId,
    };

    const lastSnapshot = state.past[state.past.length - 1];
    if (lastSnapshot) {
      if (
        lastSnapshot.pages.length === currentSnapshot.pages.length &&
        lastSnapshot.activePageId === currentSnapshot.activePageId &&
        JSON.stringify(lastSnapshot.pages) ===
          JSON.stringify(currentSnapshot.pages)
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
    const { past, future, pages, activePageId, selectedFieldId } = get();
    if (past.length === 0) return;

    const previousSnapshot = past[past.length - 1];
    const newPast = past.slice(0, -1);

    const currentSnapshot: FormBuilderSnapshot = {
      pages: structuredClone(pages),
      activePageId,
      selectedFieldId,
    };

    const targetPage =
      previousSnapshot.pages.find((p) => p.id === previousSnapshot.activePageId) ||
      previousSnapshot.pages[0];

    set({
      pages: previousSnapshot.pages,
      activePageId: targetPage.id,
      pageSizePreset: targetPage.pageSizePreset,
      orientation: targetPage.orientation,
      margins: targetPage.margins,
      fields: targetPage.fields,
      selectedFieldId: previousSnapshot.selectedFieldId,
      past: newPast,
      future: [currentSnapshot, ...future].slice(0, MAX_HISTORY_STEPS),
      canUndo: newPast.length > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const { past, future, pages, activePageId, selectedFieldId } = get();
    if (future.length === 0) return;

    const nextSnapshot = future[0];
    const newFuture = future.slice(1);

    const currentSnapshot: FormBuilderSnapshot = {
      pages: structuredClone(pages),
      activePageId,
      selectedFieldId,
    };

    const targetPage =
      nextSnapshot.pages.find((p) => p.id === nextSnapshot.activePageId) ||
      nextSnapshot.pages[0];

    const newPast = [...past.slice(-(MAX_HISTORY_STEPS - 1)), currentSnapshot];

    set({
      pages: nextSnapshot.pages,
      activePageId: targetPage.id,
      pageSizePreset: targetPage.pageSizePreset,
      orientation: targetPage.orientation,
      margins: targetPage.margins,
      fields: targetPage.fields,
      selectedFieldId: nextSnapshot.selectedFieldId,
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

  // ===== ACTIONS QUẢN LÝ TRANG (MULTI-PAGE) =====
  addPage: () => {
    get().recordHistory();
    const { pages, pageSizePreset, orientation, margins } = get();
    const newPageNumber = pages.length + 1;
    const newPage = createDefaultBlankPage(newPageNumber);
    // Kế thừa cấu hình trang hiện tại để tiện thiết kế
    newPage.pageSizePreset = pageSizePreset;
    newPage.orientation = orientation;
    newPage.margins = structuredClone(margins);

    const nextPages = [...pages, newPage];

    set({
      pages: nextPages,
      activePageId: newPage.id,
      pageSizePreset: newPage.pageSizePreset,
      orientation: newPage.orientation,
      margins: newPage.margins,
      fields: [],
      selectedFieldId: null,
    });
  },

  removePage: (pageId: string) => {
    const { pages, activePageId } = get();
    if (pages.length <= 1) return; // Không cho phép xóa trang duy nhất

    get().recordHistory();
    const pageIndex = pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const remainingPages = pages
      .filter((p) => p.id !== pageId)
      .map((p, idx) => ({
        ...p,
        pageNumber: idx + 1,
        // Nếu tên trang dạng "Trang X", cập nhật số thứ tự
        name: p.name?.startsWith("Trang ") ? `Trang ${idx + 1}` : p.name,
      }));

    let nextActivePage: CanvasPage;
    if (activePageId === pageId) {
      const nextIndex = Math.max(0, pageIndex - 1);
      nextActivePage = remainingPages[nextIndex] || remainingPages[0];
    } else {
      nextActivePage =
        remainingPages.find((p) => p.id === activePageId) || remainingPages[0];
    }

    set({
      pages: remainingPages,
      activePageId: nextActivePage.id,
      pageSizePreset: nextActivePage.pageSizePreset,
      orientation: nextActivePage.orientation,
      margins: nextActivePage.margins,
      fields: nextActivePage.fields,
      selectedFieldId: null,
    });
  },

  setActivePageId: (pageId: string) => {
    const { pages, activePageId } = get();
    if (pageId === activePageId) return;

    const targetPage = pages.find((p) => p.id === pageId);
    if (!targetPage) return;

    set({
      activePageId: targetPage.id,
      pageSizePreset: targetPage.pageSizePreset,
      orientation: targetPage.orientation,
      margins: targetPage.margins,
      fields: targetPage.fields,
      selectedFieldId: null,
    });
  },

  // ===== CẤU HÌNH TRANG ĐANG ACTIVE =====
  setPageSizePreset: (preset) => {
    get().recordHistory();
    const { pages, activePageId } = get();
    const updatedPages = pages.map((page) =>
      page.id === activePageId ? { ...page, pageSizePreset: preset } : page,
    );
    set({
      pages: updatedPages,
      pageSizePreset: preset,
    });
  },

  setOrientation: (orientation) => {
    get().recordHistory();
    const { pages, activePageId } = get();
    const updatedPages = pages.map((page) =>
      page.id === activePageId ? { ...page, orientation } : page,
    );
    set({
      pages: updatedPages,
      orientation,
    });
  },

  setMargins: (margins) => {
    get().recordHistory();
    const { pages, activePageId, margins: currentMargins } = get();
    const nextMargins = { ...currentMargins, ...margins };
    const updatedPages = pages.map((page) =>
      page.id === activePageId ? { ...page, margins: nextMargins } : page,
    );
    set({
      pages: updatedPages,
      margins: nextMargins,
    });
  },

  setMarginValue: (key, value) => {
    get().recordHistory();
    const { pages, activePageId, margins: currentMargins } = get();
    const nextMargins = { ...currentMargins, [key]: value };
    const updatedPages = pages.map((page) =>
      page.id === activePageId ? { ...page, margins: nextMargins } : page,
    );
    set({
      pages: updatedPages,
      margins: nextMargins,
    });
  },

  // ===== THAO TÁC PHẦN TỬ TRÊN TRANG ACTIVE =====
  setSelectedFieldId: (id) => set({ selectedFieldId: id }),

  selectAllFields: () => {},

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

    const { fields, pages, activePageId } = get();
    const nextFields = [...fields, newField];

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
      selectedFieldId: newField.id,
    });
  },

  updateFieldPosition: (fieldId, coordinates) => {
    get().recordHistory();
    const { fields, pages, activePageId } = get();
    const nextFields = fields.map((field) =>
      field.id === fieldId ? { ...field, ...coordinates } : field,
    );

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
    });
  },

  updateFieldStyle: (fieldId, style) => {
    get().recordHistory();
    const { fields, pages, activePageId } = get();
    const nextFields = fields.map((field) =>
      field.id === fieldId
        ? {
            ...field,
            style: {
              ...field.style,
              ...style,
            },
          }
        : field,
    );

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
    });
  },

  updateFieldData: (fieldId, data, options) => {
    if (!options?.skipHistory) {
      get().recordHistory();
    }
    const { fields, pages, activePageId } = get();
    const nextFields = fields.map((field) =>
      field.id === fieldId
        ? ({
            ...field,
            data: {
              ...field.data,
              ...data,
            },
          } as CanvasField)
        : field,
    );

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
    });
  },

  updateFieldResize: (fieldId, change) => {
    get().recordHistory();
    const { fields, pages, activePageId } = get();
    const nextFields = fields.map((item) =>
      item.id === fieldId
        ? {
            ...item,
            x: change.position.x,
            y: change.position.y,
            ...change.size,
          }
        : item,
    );

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
    });
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

      const nextFields = state.fields.map((item) =>
        item.id === fieldId ? { ...item, ...size } : item,
      );

      return {
        fields: nextFields,
        pages: updateActivePageFields(state.pages, state.activePageId, nextFields),
      };
    }),

  removeField: (fieldId) => {
    get().recordHistory();
    const { fields, pages, activePageId, selectedFieldId } = get();
    const nextFields = fields.filter((field) => field.id !== fieldId);

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
      selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId,
    });
  },

  duplicateField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    if (!target) return;

    get().recordHistory();
    const duplicatedField: CanvasField = {
      ...target,
      id: globalThis.crypto.randomUUID(),
      x: target.x + 10,
      y: target.y + 10,
      data: target.data ? structuredClone(target.data) : undefined,
    } as CanvasField;

    const { fields, pages, activePageId } = get();
    const nextFields = [...fields, duplicatedField];

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
      selectedFieldId: duplicatedField.id,
    });
  },

  copyField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    return target ? { clipboardField: { ...target } } : get();
  },

  cutField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    if (!target) return;

    get().recordHistory();
    const { fields, pages, activePageId, selectedFieldId } = get();
    const nextFields = fields.filter((field) => field.id !== fieldId);

    set({
      clipboardField: { ...target },
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
      selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId,
    });
  },

  pasteField: (offset = { x: 10, y: 10 }) => {
    const { clipboardField, fields, pages, activePageId } = get();
    if (!clipboardField) return;

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

    const nextFields = [...fields, pastedField];

    set({
      fields: nextFields,
      pages: updateActivePageFields(pages, activePageId, nextFields),
      selectedFieldId: pastedField.id,
    });
  },

  getFormSchema: () => {
    const { pages } = get();
    return exportFormSchema(pages);
  },

  setOnSave: (handler) => set({ onSave: handler }),

  setIsSaving: (isSaving) => set({ isSaving }),

  triggerSave: async () => {
    const { onSave, isSaving, getFormSchema } = get();
    if (isSaving || !onSave) return;
    try {
      set({ isSaving: true });
      await onSave(getFormSchema());
    } finally {
      set({ isSaving: false });
    }
  },

  loadFormSchema: (schema) => {
    const rawPages = schema?.pages ?? [];
    let canvasPages: CanvasPage[] = [];

    if (Array.isArray(rawPages) && rawPages.length > 0) {
      canvasPages = rawPages.map(importSchemaPageToCanvasPage);
    } else {
      canvasPages = [createDefaultBlankPage(1, "page_1")];
    }

    const firstPage = canvasPages[0];

    set({
      pages: canvasPages,
      activePageId: firstPage.id,
      pageSizePreset: firstPage.pageSizePreset,
      orientation: firstPage.orientation,
      margins: firstPage.margins,
      fields: firstPage.fields,
      selectedFieldId: null,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    });
  },

  resetForm: () => {
    const defaultPage = createDefaultBlankPage(1, "page_reset");
    set({
      pages: [defaultPage],
      activePageId: defaultPage.id,
      pageSizePreset: defaultPage.pageSizePreset,
      orientation: defaultPage.orientation,
      margins: defaultPage.margins,
      fields: defaultPage.fields,
      selectedFieldId: null,
      clipboardField: null,
      isReadOnly: false,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    });
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
