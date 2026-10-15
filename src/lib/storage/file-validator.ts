import 'server-only';
import { imageSize } from 'image-size';
import { PDFDocument } from 'pdf-lib';
import { ValidationError } from '@/shared/errors';

export class ImageValidationError extends ValidationError {
  constructor(message = 'Dữ liệu ảnh không hợp lệ') {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export class DocumentValidationError extends ValidationError {
  constructor(message = 'Dữ liệu tài liệu không hợp lệ') {
    super(message);
    this.name = 'DocumentValidationError';
  }
}

export interface ValidatedImage {
  mimeType: string;
  extension: string;
  width: number;
  height: number;
}

export interface ValidatedPdf {
  mimeType: 'application/pdf';
  extension: 'pdf';
  pageCount: number;
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

export async function validatePdfBuffer(buffer: Buffer): Promise<ValidatedPdf> {
  if (buffer.length === 0) {
    throw new DocumentValidationError('Tập tin rỗng');
  }

  // Kiểm tra nhanh marker bắt buộc của chuẩn PDF: Header %PDF- và Trailer %%EOF
  const head = buffer.subarray(0, 1024).toString('ascii');
  if (!head.includes('%PDF-')) {
    throw new DocumentValidationError('Chỉ chấp nhận file PDF');
  }

  const tail = buffer.subarray(Math.max(0, buffer.length - 1024)).toString('ascii');
  if (!tail.includes('%%EOF')) {
    throw new DocumentValidationError('File PDF bị lỗi hoặc đứt đoạn');
  }

  // Parse cấu trúc sâu bằng pdf-lib để thẩm định tính toàn vẹn của các trang
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch {
    throw new DocumentValidationError('File PDF không hợp lệ hoặc bị lỗi');
  }

  // Kiểm tra bảo vệ mật khẩu qua thuộc tính API chính thức của pdf-lib
  if (pdfDoc.isEncrypted) {
    throw new DocumentValidationError('File PDF được đặt mật khẩu');
  }

  // Kiểm tra danh mục và số lượng trang
  let pageCount = 0;
  try {
    pageCount = pdfDoc.getPageCount();
  } catch {
    throw new DocumentValidationError('Cấu trúc trang PDF bị lỗi');
  }

  if (pageCount <= 0) {
    throw new DocumentValidationError('File PDF không có trang nào');
  }

  return {
    mimeType: 'application/pdf',
    extension: 'pdf',
    pageCount,
  };
}
