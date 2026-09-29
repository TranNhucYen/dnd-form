import 'server-only';
import crypto from 'crypto';

// Key có dạng: <timestamp>-<32 ký tự hex>.<ext>
export function buildStorageKey(ext: string): string {
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'bin';
  const uniqueId = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${uniqueId}.${safeExt}`;
}

export function buildFileUrl(baseUrl: string, key: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;
}
