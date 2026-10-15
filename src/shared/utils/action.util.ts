import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { ZodError } from 'zod'
import { AppError } from '@/shared/errors'
import type { ActionFailure } from '@/shared/types/action.type'

/**
  Dụng để xử lý lỗi trong Server Action
  @param error - Lỗi được ném ra từ Server Action
  @param actionName - Tên của Server Action (tùy chọn, để ghi log)
  @returns {ActionFailure} Đối tượng phản hồi ActionFailure {@link ActionFailure}
 */
export function handleActionError(error: unknown, actionName?: string): ActionFailure {
  if (isRedirectError(error)) {
    throw error
  }

  if (typeof error === 'object' && error !== null && 'digest' in error) {
    const digest = String((error as { digest?: unknown }).digest)
    if (digest.startsWith('NEXT_')) {
      throw error
    }
  }

  if (error instanceof AppError) {
    return {
      success: false,
      code: error.code,
      error: error.message,
      details: error.details,
    }
  }

  if (error instanceof ZodError) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      error: error.issues[0]?.message || 'Dữ liệu không hợp lệ',
      details: error.flatten().fieldErrors,
    }
  }

  // Xử lý lỗi upload vượt quá dung lượng cho phép hoặc stream multipart bị ngắt giữa chừng
  if (isPayloadSizeError(error)) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      error: 'Kích thước tập tin tải lên vượt quá giới hạn cho phép của hệ thống.',
    }
  }

  const tag = actionName ? `[Server Action: ${actionName}]` : '[Server Action Error]'
  console.error(tag, error)

  return {
    success: false,
    code: 'INTERNAL_ERROR',
    error: 'Đã có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau.',
  }
}

function isPayloadSizeError(error: unknown): boolean {
  if (error instanceof Error) {
    // Busboy / Next.js ngắt luồng đọc multipart khi upload vượt quá bodySizeLimit
    if (error.message.includes('Unexpected end of form')) return true
    if (error.message.includes('body size') || error.message.includes('body exceeded')) return true
    if ('status' in error && (error as { status?: number }).status === 413) return true
  }
  return false
}

