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
      error: "Định dạng ảnh không được hỗ trợ (chỉ nhận JPG, PNG, WEBP)",
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: "Kích thước ảnh vượt quá 5MB",
    };
  }

  return { valid: true };
}
