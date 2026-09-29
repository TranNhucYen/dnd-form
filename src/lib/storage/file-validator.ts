import 'server-only';
import { imageSize } from 'image-size';

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export interface ValidatedImage {
  mimeType: string;
  extension: string;
  width: number;
  height: number;
}

const ALLOWED_TYPES: Record<string, { mime: string; ext: string }> = {
  jpg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

const MAX_DIMENSION = 8000;

export function validateImageBuffer(buffer: Buffer): ValidatedImage {
  if (buffer.length === 0) {
    throw new ImageValidationError('Tập tin rỗng');
  }

  let info: ReturnType<typeof imageSize>;
  try {
    info = imageSize(buffer);
  } catch {
    throw new ImageValidationError('Tập tin không phải là ảnh hợp lệ hoặc dữ liệu bị lỗi');
  }

  const typeInfo = info.type ? ALLOWED_TYPES[info.type] : undefined;
  if (!typeInfo || !info.width || !info.height) {
    throw new ImageValidationError('Định dạng ảnh không được hỗ trợ (chỉ nhận JPG, PNG, WEBP)');
  }

  if (info.width > MAX_DIMENSION || info.height > MAX_DIMENSION) {
    throw new ImageValidationError(`Kích thước ảnh tối đa ${MAX_DIMENSION}x${MAX_DIMENSION}px`);
  }

  return {
    mimeType: typeInfo.mime,
    extension: typeInfo.ext,
    width: info.width,
    height: info.height,
  };
}
