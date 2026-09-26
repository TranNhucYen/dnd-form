import { isMockMode } from '@/lib/config'
import { drizzleDashboardRepository } from './dashboard.repository'
import { mockDashboardRepository } from './dashboard.mock.repository'

export const dashboardRepository = isMockMode()
  ? mockDashboardRepository
  : drizzleDashboardRepository

export * from './dashboard.repository'
