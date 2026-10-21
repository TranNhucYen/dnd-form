import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";

export interface FormDraftData {
  formId: number | null;
  title: string;
  schema: FormSchemaJson;
  savedAt: number;
}

const DRAFT_STORAGE_PREFIX = "dnd_form_draft";

/**
 * Trả về key lưu trữ trong localStorage dựa trên formId
 */
export function getDraftStorageKey(formId: number | null): string {
  return formId ? `${DRAFT_STORAGE_PREFIX}_edit_${formId}` : `${DRAFT_STORAGE_PREFIX}_new`;
}

/**
 * Tạo snapshot chuỗi để so sánh dirty state (phát hiện thay đổi chưa lưu)
 */
export function createFormSnapshot(title: string, schema: FormSchemaJson): string {
  return JSON.stringify({
    title: (title || "").trim(),
    schema: schema || { pages: [] },
  });
}

export function saveFormDraft(
  formId: number | null,
  title: string,
  schema: FormSchemaJson,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = getDraftStorageKey(formId);
    const draftData: FormDraftData = {
      formId,
      title: title.trim() || "Biểu mẫu chưa đặt tên",
      schema,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(key, JSON.stringify(draftData));
    return true;
  } catch (error) {
    console.warn("[DraftStorage] Không thể lưu bản nháp vào localStorage:", error);
    return false;
  }
}

export function getFormDraft(formId: number | null): FormDraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getDraftStorageKey(formId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FormDraftData;
    if (parsed && typeof parsed === "object" && parsed.schema && typeof parsed.title === "string") {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn("[DraftStorage] Không thể đọc bản nháp từ localStorage:", error);
    return null;
  }
}

export function clearFormDraft(formId: number | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getDraftStorageKey(formId);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn("[DraftStorage] Không thể xóa bản nháp khỏi localStorage:", error);
  }
}

export function hasFormDraft(formId: number | null): boolean {
  return getFormDraft(formId) !== null;
}
