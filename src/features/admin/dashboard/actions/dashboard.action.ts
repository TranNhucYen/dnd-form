'use server'

import { handleActionError } from '@/shared/utils/action.util'
import { requirePermission } from '@/shared/auth/authorization'
import { PERMISSIONS } from '@/shared/auth/permissions'
import { dashboardService } from '../services/dashboard.service'
import type { AdminDashboardStats, ActionResponse } from '../types/dashboard.type'

export async function getDashboardStatsAction(): Promise<ActionResponse<AdminDashboardStats>> {
  try {
    await requirePermission(PERMISSIONS.dashboard.read)
    const data = await dashboardService.getDashboardStats()
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getDashboardStatsAction')
  }
}
