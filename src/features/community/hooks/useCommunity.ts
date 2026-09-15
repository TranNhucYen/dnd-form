'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ContributionItem,
  ContributeFormInput,
} from '../types/community.type'
import {
  getMyContributionsAction,
  submitContributionAction,
} from '../actions/community.action'

export function useCommunity() {
  const [contributions, setContributions] = useState<ContributionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const contRes = await getMyContributionsAction()
      setContributions(contRes)
    } catch (err) {
      console.error(err)
      setError('Đã xảy ra lỗi khi tải dữ liệu đóng góp cộng đồng.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const submitContribution = async (input: ContributeFormInput) => {
    const newContribution = await submitContributionAction(input)
    setContributions((prev) => [newContribution, ...prev])
    return newContribution
  }

  return {
    contributions,
    isLoading,
    error,
    submitContribution,
    refetch: fetchData,
  }
}
