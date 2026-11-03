import { FORM_BUILDER_LABELS } from "../../constants/labels";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPT_IMAGE_TYPES = "image/png,image/jpeg,image/webp";

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/** Validate định dạng và dung lượng file ảnh tại client  */
export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: FORM_BUILDER_LABELS.fields.image.unsupported,
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: FORM_BUILDER_LABELS.fields.image.tooLarge,
    };
  }

  return { valid: true };
}
