'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ContributionItem,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
} from '../types/community.type'
import {
  getMyContributionsAction,
  submitContributionAction,
  getCommunityCategoriesAction,
  getUserFormsForContributeAction,
} from '../actions/community.action'

export function useCommunity() {
  const [contributions, setContributions] = useState<ContributionItem[]>([])
  const [categories, setCategories] = useState<CommunityCategory[]>([])
  const [userForms, setUserForms] = useState<UserFormOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [contRes, catRes, formsRes] = await Promise.all([
        getMyContributionsAction(),
        getCommunityCategoriesAction(),
        getUserFormsForContributeAction(),
      ])

      if (contRes.success) {
        setContributions(contRes.data)
      } else {
        setError(contRes.error)
      }

      if (catRes.success) {
        setCategories(catRes.data)
      }

      if (formsRes.success) {
        setUserForms(formsRes.data)
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu cộng đồng:', err)
      setError('Đã xảy ra lỗi khi tải dữ liệu đóng góp cộng đồng.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const submitContribution = async (input: ContributeFormInput) => {
    const res = await submitContributionAction(input)
    if (!res.success) {
      throw new Error(res.error)
    }
    setContributions((prev) => [res.data, ...prev])
    return res.data
  }

  return {
    contributions,
    categories,
    userForms,
    isLoading,
    error,
    submitContribution,
    refetch: fetchData,
  }
}
