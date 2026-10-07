import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import type { IStorageService, LocalStorageConfig, UploadFileInput, UploadResult } from './storage.types';
import { buildStorageKey, buildFileUrl } from './storage.keys';

/**
 * Chuyển key thành đường dẫn tuyệt đối an toàn bên trong thư mục lưu trữ.
 * Trả về null nếu key có dấu hiệu path traversal . Dùng chung cho adapter và route.
 */
export function resolveLocalPath(localDir: string, key: string): string | null {
  if (key.includes('\0') || key.split(/[\\/]/).includes('..')) return null;

  const root = path.resolve(/*turbopackIgnore: true*/ process.cwd(), localDir);
  const target = path.resolve(root, key);
  return target.startsWith(root + path.sep) ? target : null;
}

export class LocalStorageAdapter implements IStorageService {
  constructor(private readonly config: LocalStorageConfig) {}

  async upload(input: UploadFileInput): Promise<UploadResult> {
    const key = buildStorageKey(input.extension);
    const root = path.resolve(/*turbopackIgnore: true*/ process.cwd(), this.config.localDir);
    await fs.mkdir(root, { recursive: true });

    const targetPath = resolveLocalPath(this.config.localDir, key);
    if (!targetPath) throw new Error('Bảo mật: đường dẫn lưu trữ không hợp lệ');

    await fs.writeFile(targetPath, input.file, { flag: 'wx' }); // không ghi đè file có sẵn

    return {
      key,
      url: this.getUrl(key),
      mimeType: input.mimeType,
      fileSize: input.file.byteLength,
    };
  }

  getUrl(key: string): string {
    return buildFileUrl(this.config.localPublicUrl, key);
  }
}
