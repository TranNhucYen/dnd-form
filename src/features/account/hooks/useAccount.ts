'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import type {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../types/account.type'
import {
  getProfileAction,
  updateProfileAction,
  changePasswordAction,
} from '../actions/account.action'

export const ACCOUNT_PROFILE_KEY = ['account', 'profile'] as const

export function useAccount() {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ACCOUNT_PROFILE_KEY,
    queryFn: async (): Promise<UserProfile | null> => {
      const res = await getProfileAction()
      if (!res.success) {
        if (res.code === 'ACCOUNT_BLOCKED' || res.code === 'UNAUTHORIZED') {
          router.push('/login')
        }
        throw new Error(res.error)
      }
      return res.data
    },
  })

  useEffect(() => {
    if (profileQuery.error) {
      toast.error(profileQuery.error.message)
    }
  }, [profileQuery.error])

  const updateProfile = async (data: UpdateProfileInput): Promise<void> => {
    const res = await updateProfileAction(data)
    if (!res.success) {
      if (res.code === 'ACCOUNT_BLOCKED' || res.code === 'UNAUTHORIZED') {
        router.push('/login')
      }
      const errorMsg = res.error
      toast.error(errorMsg)
      throw new Error(errorMsg)
    }
    queryClient.setQueryData<UserProfile | null>(ACCOUNT_PROFILE_KEY, res.data)
    toast.success(t('account.profileUpdated'))
    router.refresh()
  }

  const changePassword = async (data: ChangePasswordInput): Promise<void> => {
    const res = await changePasswordAction(data)
    if (!res.success) {
      if (res.code === 'ACCOUNT_BLOCKED' || res.code === 'UNAUTHORIZED') {
        router.push('/login')
      }
      const errorMsg = res.error
      throw new Error(errorMsg)
    }
  }

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error?.message ?? null,
    refetch: profileQuery.refetch,
    updateProfile,
    changePassword,
  }
}
