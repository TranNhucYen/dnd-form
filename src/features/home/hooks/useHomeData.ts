'use client'

import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getHomeDashboardAction } from '@/features/home/actions/home.action'
import type { HomeDashboardData } from '@/features/home/types/home.type'

export const HOME_DASHBOARD_KEY = ['home', 'dashboard'] as const

const EMPTY_HOME_DATA: HomeDashboardData = {
  recentForms: [],
  featuredTemplates: [],
  totalFormsCount: 0,
}

async function fetchHomeData(): Promise<HomeDashboardData> {
  const res = await getHomeDashboardAction()
  if (!res.success) {
    throw new Error(res.error || 'Đã xảy ra lỗi khi tải dữ liệu trang chủ.')
  }
  return res.data
}

export function useHomeData() {
  const homeQuery = useQuery({
    queryKey: HOME_DASHBOARD_KEY,
    queryFn: fetchHomeData,
  })

  useEffect(() => {
    if (homeQuery.error) {
      console.error('Lỗi khi nạp dữ liệu trang chủ:', homeQuery.error)
    }
  }, [homeQuery.error])

  const data = useMemo(() => homeQuery.data ?? EMPTY_HOME_DATA, [homeQuery.data])

  return {
    recentForms: data.recentForms,
    featuredTemplates: data.featuredTemplates,
    totalFormsCount: data.totalFormsCount,
    isLoading: homeQuery.isLoading,
    error: homeQuery.error?.message ?? null,
    refetch: homeQuery.refetch,
  }
}
