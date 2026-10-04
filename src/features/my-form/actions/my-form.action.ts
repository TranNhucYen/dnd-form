'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { myFormService } from '../services/my-form.service'
import type {
  MyForm,
  CreateBlankFormInput,
  ActionResponse,
  SaveSharingInput,
  ShareTokenResult,
} from '../types/my-form.type'

async function getAuthenticatedUserId(): Promise<
  { userId: number } | { error: string; code: string }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.', code: 'UNAUTHORIZED' }
  }

  const user = await verifyJwtToken(token)
  if (!user) {
    return {
      error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      code: 'UNAUTHORIZED',
    }
  }

  if (user.status === 'blocked') {
    cookieStore.delete('auth_token')
    return { error: 'Tài khoản của bạn đã bị khóa.', code: 'ACCOUNT_BLOCKED' }
  }

  return { userId: user.id }
}

export async function getMyFormsAction(): Promise<ActionResponse<MyForm[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await myFormService.getMyForms(authResult.userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getMyFormsAction')
  }
}

export async function getMyFormByIdAction(
  id: number
): Promise<ActionResponse<MyForm>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await myFormService.getMyFormById(authResult.userId, id)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getMyFormByIdAction')
  }
}

export async function createBlankFormAction(
  input: CreateBlankFormInput
): Promise<ActionResponse<MyForm>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await myFormService.createBlankForm(authResult.userId, input)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'createBlankFormAction')
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
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await myFormService.duplicateForm(
      authResult.userId,
      id,
      customName
    )
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'duplicateFormAction')
  }
}

export async function deleteFormAction(id: number): Promise<ActionResponse<boolean>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const success = await myFormService.deleteForm(authResult.userId, id)
    return { success: true, data: success }
  } catch (error) {
    return handleActionError(error, 'deleteFormAction')
  }
}

export async function getFormShareTokenAction(
  formId: number
): Promise<ActionResponse<ShareTokenResult>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await myFormService.getFormShareToken(authResult.userId, formId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getFormShareTokenAction')
  }
}

export async function saveFormSharingAction(
  formId: number,
  input: SaveSharingInput
): Promise<ActionResponse<ShareTokenResult>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await myFormService.saveFormSharing(authResult.userId, formId, input)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'saveFormSharingAction')
  }
}
