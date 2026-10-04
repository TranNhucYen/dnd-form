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

  const tag = actionName ? `[Server Action: ${actionName}]` : '[Server Action Error]'
  console.error(tag, error)

  return {
    success: false,
    code: 'INTERNAL_ERROR',
    error: 'Đã có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau.',
  }
}
