import 'server-only';
import type { StorageConfig } from './storage.types';

export function getStorageConfig(): StorageConfig {
  const driver = process.env.STORAGE_DRIVER || 'local';

  if (driver === 'local') {
    return {
      driver: 'local',
      localDir: process.env.LOCAL_STORAGE_DIR || 'storage/uploads',
      localPublicUrl: process.env.LOCAL_PUBLIC_URL || '/api/files',
    };
  }

  if (driver === 's3') {
    const required = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_PUBLIC_URL'];
    const missing = required.filter((name) => !process.env[name]);
    if (missing.length > 0) {
      throw new Error(`STORAGE_DRIVER=s3 thiếu biến môi trường: ${missing.join(', ')}`);
    }

    const publicUrl = process.env.S3_PUBLIC_URL!;
    if (process.env.NODE_ENV === 'production' && /localhost|127\.0\.0\.1/.test(publicUrl)) {
      throw new Error('S3_PUBLIC_URL trong production không được trỏ vào localhost');
    }

    return {
      driver: 's3',
      bucket: process.env.S3_BUCKET!,
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      publicUrl,
    };
  }

  throw new Error(`STORAGE_DRIVER="${driver}" không hợp lệ. Chỉ chấp nhận "local" hoặc "s3".`);
}
