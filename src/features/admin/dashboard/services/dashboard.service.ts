import { dashboardRepository } from '../repositories'
import type { AdminDashboardStats } from '../types/dashboard.type'

export const dashboardService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return await dashboardRepository.getDashboardStats()
  },
}
