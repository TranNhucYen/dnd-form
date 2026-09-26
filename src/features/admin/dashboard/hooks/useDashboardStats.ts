'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { getDashboardStatsAction } from '../actions/dashboard.action'
import type { AdminDashboardStats } from '../types/dashboard.type'

export function useDashboardStats() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getDashboardStatsAction()
      if (res.success) {
        setStats(res.data)
      } else {
        setError(res.error)
        toast.error(res.error)
      }
    } catch {
      const errorMsg = 'Không thể tải số liệu thống kê.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}
