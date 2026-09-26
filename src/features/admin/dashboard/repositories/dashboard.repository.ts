import { db } from '@/db'
import { user, template, templateCategory } from '@/db/schema'
import { count, sum } from 'drizzle-orm'
import type { AdminDashboardStats } from '../types/dashboard.type'

export interface IDashboardRepository {
  getDashboardStats(): Promise<AdminDashboardStats>
}

export const drizzleDashboardRepository: IDashboardRepository = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [userRes, categoryRes, templateRes] = await Promise.all([
      db.select({ totalUsers: count() }).from(user),
      db.select({ totalCategories: count() }).from(templateCategory),
      db
        .select({
          totalTemplates: count(),
          totalDownloads: sum(template.downloads),
        })
        .from(template),
    ])

    return {
      totalUsers: userRes[0]?.totalUsers ?? 0,
      totalCategories: categoryRes[0]?.totalCategories ?? 0,
      totalTemplates: templateRes[0]?.totalTemplates ?? 0,
      totalDownloads: Number(templateRes[0]?.totalDownloads) || 0,
    }
  },
}
