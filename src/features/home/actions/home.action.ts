'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { UnauthorizedError, ForbiddenError } from '@/shared/errors'
import { UserStatus } from '@/shared/types/user.type'
import { homeService } from '../services/home.service'
import type { HomeDashboardData, ActionResponse } from '../types/home.type'

async function getAuthenticatedUserId(): Promise<number> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    throw new UnauthorizedError('Bạn cần đăng nhập để thực hiện thao tác này.')
  }

  const user = await verifyJwtToken(token)
  if (!user) {
    throw new UnauthorizedError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  }

  if (user.status === UserStatus.BLOCKED) {
    cookieStore.delete('auth_token')
    throw new ForbiddenError('Tài khoản của bạn đã bị khóa.', 'ACCOUNT_BLOCKED')
  }

  return user.id
}

export async function getHomeDashboardAction(): Promise<ActionResponse<HomeDashboardData>> {
  try {
    const userId = await getAuthenticatedUserId()
    const data = await homeService.getHomeDashboardData(userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getHomeDashboardAction')
  }
}
