import { dashboardRepository } from '../repositories'
import type { AdminDashboardStats } from '../types/dashboard.type'

export const dashboardService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      return await dashboardRepository.getDashboardStats()
    } catch (error) {
      console.error('Lỗi khi lấy số liệu thống kê dashboard admin:', error)
      throw new Error('Không thể tải số liệu thống kê dashboard.')
    }
  },
}
