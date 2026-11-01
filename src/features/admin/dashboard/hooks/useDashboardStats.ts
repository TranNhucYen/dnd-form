'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getDashboardStatsAction } from '../actions/dashboard.action'
import type { AdminDashboardStats } from '../types/dashboard.type'

export const ADMIN_DASHBOARD_STATS_KEY = ['admin', 'dashboard-stats'] as const

export function useDashboardStats() {
  const statsQuery = useQuery({
    queryKey: ADMIN_DASHBOARD_STATS_KEY,
    queryFn: async (): Promise<AdminDashboardStats> => {
      const res = await getDashboardStatsAction()
      if (!res.success) {
        throw new Error(res.error || 'Không thể tải số liệu thống kê.')
      }
      return res.data
    },
    staleTime: 0,
  })

  useEffect(() => {
    if (statsQuery.error) {
      toast.error(statsQuery.error.message)
    }
  }, [statsQuery.error])

  return {
    stats: statsQuery.data ?? null,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error?.message ?? null,
    refetch: statsQuery.refetch,
  }
}
