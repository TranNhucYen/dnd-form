'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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

export const COMMUNITY_KEY = ['community', 'data'] as const

interface CommunityData {
  contributions: ContributionItem[]
  categories: CommunityCategory[]
  userForms: UserFormOption[]
}

const EMPTY_COMMUNITY_DATA: CommunityData = {
  contributions: [],
  categories: [],
  userForms: [],
}

export function useCommunity() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const communityQuery = useQuery({
    queryKey: COMMUNITY_KEY,
    queryFn: async (): Promise<CommunityData> => {
      const [contRes, catRes, formsRes] = await Promise.all([
        getMyContributionsAction(),
        getCommunityCategoriesAction(),
        getUserFormsForContributeAction(),
      ])

      if (!contRes.success) {
        if (
          contRes.code === 'ACCOUNT_BLOCKED' ||
          contRes.code === 'UNAUTHORIZED'
        ) {
          router.replace('/login')
        }
        throw new Error(contRes.error)
      }

      return {
        contributions: contRes.data,
        categories: catRes.success ? catRes.data : [],
        userForms: formsRes.success ? formsRes.data : [],
      }
    },
  })

  useEffect(() => {
    if (communityQuery.error) {
      console.error('Lỗi khi tải dữ liệu cộng đồng:', communityQuery.error)
    }
  }, [communityQuery.error])

  const data = useMemo(
    () => communityQuery.data ?? EMPTY_COMMUNITY_DATA,
    [communityQuery.data]
  )

  const { contributions, categories, userForms } = data

  const submitContribution = async (input: ContributeFormInput) => {
    const res = await submitContributionAction(input)
    if (!res.success) {
      if (res.code === 'ACCOUNT_BLOCKED' || res.code === 'UNAUTHORIZED') {
        router.replace('/login')
      }
      throw new Error(res.error)
    }
    queryClient.setQueryData<CommunityData>(COMMUNITY_KEY, (prev) => {
      const current = prev ?? EMPTY_COMMUNITY_DATA
      return {
        ...current,
        contributions: [res.data, ...current.contributions],
      }
    })
    return res.data
  }

  return {
    contributions,
    categories,
    userForms,
    isLoading: communityQuery.isLoading,
    error: communityQuery.error?.message ?? null,
    submitContribution,
    refetch: communityQuery.refetch,
  }
}
