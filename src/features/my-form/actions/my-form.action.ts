'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { myFormService } from '../services/my-form.service'
import type {
  MyForm,
  CreateBlankFormInput,
  ActionResponse,
  SaveSharingInput,
  ShareTokenResult,
} from '../types/my-form.type'

async function getAuthenticatedUserId(): Promise<
  { userId: number } | { error: string }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.' }
  }

  const user = await verifyJwtToken(token)
  if (!user) {
    return {
      error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    }
  }

  return { userId: user.id }
}

export async function getMyFormsAction(): Promise<ActionResponse<MyForm[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await myFormService.getMyForms(authResult.userId)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải danh sách biểu mẫu.'
    }
  }
}

export async function getMyFormByIdAction(
  id: number
): Promise<ActionResponse<MyForm>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await myFormService.getMyFormById(authResult.userId, id)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin biểu mẫu.',
    }
  }
}

export async function createBlankFormAction(
  input: CreateBlankFormInput
): Promise<ActionResponse<MyForm>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await myFormService.createBlankForm(authResult.userId, input)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo biểu mẫu.',
    }
  }
}

/**
 * Nhân bản biểu mẫu
 */
export async function duplicateFormAction(
  id: number,
  customName?: string
): Promise<ActionResponse<MyForm>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await myFormService.duplicateForm(
      authResult.userId,
      id,
      customName
    )
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi nhân bản biểu mẫu.',
    }
  }
}


export async function deleteFormAction(id: number): Promise<ActionResponse<boolean>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const success = await myFormService.deleteForm(authResult.userId, id)
    return { success: true, data: success }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xóa biểu mẫu.',
    }
  }
}

export async function getFormShareTokenAction(
  formId: number
): Promise<ActionResponse<ShareTokenResult>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await myFormService.getFormShareToken(authResult.userId, formId)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi tải thông tin chia sẻ.',
    }
  }
}

export async function saveFormSharingAction(
  formId: number,
  input: SaveSharingInput
): Promise<ActionResponse<ShareTokenResult>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await myFormService.saveFormSharing(authResult.userId, formId, input)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lưu cài đặt chia sẻ.',
    }
  }
}

