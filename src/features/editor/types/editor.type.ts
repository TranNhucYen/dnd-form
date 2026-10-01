import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";

/** Dữ liệu đầu vào khi lưu biểu mẫu */
export interface SaveFormInput {
  formId?: number | null;
  title?: string;
  description?: string;
  schema: FormSchemaJson;
}

/** Kết quả trả về sau khi lưu biểu mẫu thành công */
export interface SaveFormResult {
  formId: number;
  schemaId: number;
  title: string;
  updatedAt: string;
}

/** Chi tiết biểu mẫu và schema nạp từ cơ sở dữ liệu */
export interface FormDetailResult {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  schemaId: number;
  schemaContent: FormSchemaJson;
  media: Array<{
    id: number;
    mediaType: "signature" | "image" | "document";
    signatureBase64: string | null;
    fileUrl: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
  currentUserPermission?: 'owner' | 'edit' | 'view';
}

/** Cấu trúc phản hồi chuẩn của Server Action */
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
