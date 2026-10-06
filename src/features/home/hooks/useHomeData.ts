'use client'

import { useState, useEffect, useCallback } from 'react'
import { getHomeDashboardAction } from '@/features/home/actions/home.action'
import type { MyForm } from '@/features/my-form/types/my-form.type'
import type { Template } from '@/features/templates/types/template.type'

export function useHomeData() {
  const [recentForms, setRecentForms] = useState<MyForm[]>([])
  const [featuredTemplates, setFeaturedTemplates] = useState<Template[]>([])
  const [totalFormsCount, setTotalFormsCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getHomeDashboardAction()

      if (res.success) {
        setRecentForms(res.data.recentForms)
        setFeaturedTemplates(res.data.featuredTemplates)
        setTotalFormsCount(res.data.totalFormsCount)
      } else {
        setError(res.error)
      }
    } catch (err) {
      console.error('Lỗi khi nạp dữ liệu trang chủ:', err)
      setError('Đã xảy ra lỗi khi tải dữ liệu trang chủ.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    const loadInitialData = async () => {
      try {
        const res = await getHomeDashboardAction()
        if (ignore) return

        if (res.success) {
          setRecentForms(res.data.recentForms)
          setFeaturedTemplates(res.data.featuredTemplates)
          setTotalFormsCount(res.data.totalFormsCount)
        } else {
          setError(res.error)
        }
      } catch (err) {
        if (!ignore) {
          console.error('Lỗi khi nạp dữ liệu trang chủ:', err)
          setError('Đã xảy ra lỗi khi tải dữ liệu trang chủ.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      ignore = true
    }
  }, [])

  return {
    recentForms,
    featuredTemplates,
    totalFormsCount,
    isLoading,
    error,
    refetch: fetchData,
  }
}
