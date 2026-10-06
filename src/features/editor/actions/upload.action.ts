'use server';

import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/jwt';
import {
  getStorageService,
  validateImageBuffer,
  ImageValidationError,
  type UploadResult,
} from '@/lib/storage';
import { handleActionError } from '@/shared/utils/action.util';
import type { ActionResponse } from '@/shared/types/action.type';

export type UploadActionResponse = ActionResponse<UploadResult>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadMediaAction(formData: FormData): Promise<UploadActionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return { success: false, error: 'Chưa đăng nhập', code: 'UNAUTHORIZED' };

    const user = await verifyJwtToken(token);
    if (!user?.id) return { success: false, error: 'Phiên làm việc hết hạn', code: 'UNAUTHORIZED' };
    if (user.status === 'blocked') {
      cookieStore.delete('auth_token');
      return { success: false, error: 'Tài khoản của bạn đã bị khóa', code: 'ACCOUNT_BLOCKED' };
    }

    const file = formData.get('file');
    if (!(file instanceof File)) return { success: false, error: 'Không có tập tin tải lên', code: 'VALIDATION_ERROR' };
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'Kích thước ảnh vượt quá giới hạn 5MB', code: 'VALIDATION_ERROR' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Không tin file.type / file.name từ client: đọc cấu trúc ảnh thật
    const image = validateImageBuffer(buffer);

    const result = await getStorageService().upload({
      file: buffer,
      mimeType: image.mimeType,
      extension: image.extension,
    });

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ImageValidationError) {
      return { success: false, error: error.message, code: 'VALIDATION_ERROR' };
    }
    return handleActionError(error, 'uploadMediaAction');
  }
}
