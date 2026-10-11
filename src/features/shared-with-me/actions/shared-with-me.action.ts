'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { sharedWithMeService } from '../services/shared-with-me.service'
import type { SharedWithMeItem, ActionResponse } from '../types/shared-with-me.type'

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

export async function getSharedWithMeAction(): Promise<ActionResponse<SharedWithMeItem[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await sharedWithMeService.getSharedWithMeForms(authResult.userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getSharedWithMeAction')
  }
}
