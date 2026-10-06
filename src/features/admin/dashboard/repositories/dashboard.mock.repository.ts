import type { IDashboardRepository } from './dashboard.repository'
import type { AdminDashboardStats } from '../types/dashboard.type'
import { mockAdminUsers } from '../../user/repositories/user.mock.repository'
import { mockAdminTemplates } from '../../template/repositories/template.mock.repository'
import { mockCategories } from '../../category/repositories/category.mock.repository'

export const mockDashboardRepository: IDashboardRepository = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const totalDownloads = mockAdminTemplates.reduce((acc, t) => acc + (t.downloads || 0), 0)

    return {
      totalUsers: mockAdminUsers.length,
      totalTemplates: mockAdminTemplates.length,
      totalCategories: mockCategories.length,
      totalDownloads,
    }
  },
}
