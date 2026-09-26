'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { dashboardService } from '../services/dashboard.service'
import type { AdminDashboardStats, ActionResponse } from '../types/dashboard.type'

async function getAuthenticatedAdmin(): Promise<{ userId: number; fullName: string } | { error: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Cần đăng nhập quyền admin để thực hiện thao tác này' }
  }

  const user = await verifyJwtToken(token)
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return { error: 'Phiên làm việc hết hạn hoặc không có quyền admin' }
  }

  return { userId: user.id, fullName: user.fullName }
}

export async function getDashboardStatsAction(): Promise<ActionResponse<AdminDashboardStats>> {
  try {
    const authResult = await getAuthenticatedAdmin()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await dashboardService.getDashboardStats()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải số liệu thống kê',
    }
  }
}
