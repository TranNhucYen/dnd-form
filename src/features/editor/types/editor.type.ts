export type { ActionResponse } from '@/shared/types/action.type'
export type { FormAccessPermission } from '@/shared/types/share.type'
export type { SchemaMediaType } from '@/shared/types/media.type'

import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import type { FormAccessPermission } from '@/shared/types/share.type';
import type { SchemaMediaType } from '@/shared/types/media.type';

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
    mediaType: SchemaMediaType;
    signatureBase64: string | null;
    fileUrl: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
  currentUserPermission?: FormAccessPermission;
}
