'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { dashboardService } from '../services/dashboard.service'
import type { AdminDashboardStats, ActionResponse } from '../types/dashboard.type'

async function getAuthenticatedAdmin(): Promise<
  { userId: number; fullName: string } | { error: string; code: string }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Cần đăng nhập quyền admin để thực hiện thao tác này', code: 'UNAUTHORIZED' }
  }

  const user = await verifyJwtToken(token)
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return { error: 'Phiên làm việc hết hạn hoặc không có quyền admin', code: 'FORBIDDEN' }
  }

  if (user.status === 'blocked') {
    cookieStore.delete('auth_token')
    return { error: 'Tài khoản của bạn đã bị khóa', code: 'ACCOUNT_BLOCKED' }
  }

  return { userId: user.id, fullName: user.fullName }
}

export async function getDashboardStatsAction(): Promise<ActionResponse<AdminDashboardStats>> {
  try {
    const authResult = await getAuthenticatedAdmin()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await dashboardService.getDashboardStats()
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getDashboardStatsAction')
  }
}
