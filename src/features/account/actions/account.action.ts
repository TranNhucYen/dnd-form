'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken, signJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { accountService } from '../services/account.service'
import {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
  ActionResponse,
} from '../types/account.type'

async function getAuthenticatedUser(): Promise<
  { userId: number; authUser: any } | { error: string; code: string }
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

  return { userId: user.id, authUser: user }
}

export async function getProfileAction(): Promise<ActionResponse<UserProfile>> {
  try {
    const authResult = await getAuthenticatedUser()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await accountService.getProfile(authResult.userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getProfileAction')
  }
}

export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<ActionResponse<UserProfile>> {
  try {
    const authResult = await getAuthenticatedUser()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const updatedProfile = await accountService.updateProfile(authResult.userId, input)

    // Cập nhật lại cookie JWT với tên mới để đồng bộ trên toàn ứng dụng
    try {
      const newToken = await signJwtToken({
        ...authResult.authUser,
        fullName: updatedProfile.name,
      })
      const cookieStore = await cookies()
      cookieStore.set({
        name: 'auth_token',
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    } catch (cookieError) {
      console.error('Lỗi khi làm mới auth cookie sau khi đổi tên:', cookieError)
    }

    return { success: true, data: updatedProfile }
  } catch (error) {
    return handleActionError(error, 'updateProfileAction')
  }
}

export async function changePasswordAction(input: ChangePasswordInput): Promise<ActionResponse<boolean>> {
  try {
    const authResult = await getAuthenticatedUser()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    await accountService.changePassword(authResult.userId, input)
    return { success: true, data: true }
  } catch (error) {
    return handleActionError(error, 'changePasswordAction')
  }
}
