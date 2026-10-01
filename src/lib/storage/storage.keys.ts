import 'server-only';
import crypto from 'crypto';

// Key có dạng: <timestamp>-<32 ký tự hex>.<ext>
const STORAGE_KEY_PATTERN = /^\d+-[a-f0-9]{32}\.(jpg|png|webp)$/;

export function buildStorageKey(ext: string): string {
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'bin';
  const uniqueId = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${uniqueId}.${safeExt}`;
}

/** Kiểm tra key có đúng định dạng an toàn do hệ thống sinh ra hay không */
export function isValidStorageKey(key: string): boolean {
  return typeof key === 'string' && STORAGE_KEY_PATTERN.test(key);
}

export function buildFileUrl(baseUrl: string, key: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;
}
