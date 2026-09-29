import 'server-only';
import { getStorageConfig } from './storage.config';
import { LocalStorageAdapter } from './local.adapter';
import { S3StorageAdapter } from './s3.adapter';
import type { IStorageService } from './storage.types';

let instance: IStorageService | undefined;

/** Lazy initialization: không đọc env lúc import, nên `next build` không lỗi khi thiếu biến. */
export function getStorageService(): IStorageService {
  if (!instance) {
    const config = getStorageConfig();
    instance = config.driver === 's3' ? new S3StorageAdapter(config) : new LocalStorageAdapter(config);
  }
  return instance;
}

export type { IStorageService, UploadFileInput, UploadResult } from './storage.types';
export { validateImageBuffer, ImageValidationError } from './file-validator';
