'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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

export function useAccount() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getProfileAction()
      if (res.success) {
        setProfile(res.data)
      } else {
        if (res.code === 'ACCOUNT_BLOCKED' || res.code === 'UNAUTHORIZED') {
          router.push('/login')
          return
        }
        const errorMsg = res.error
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

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
    setProfile(res.data)
    toast.success('Cập nhật hồ sơ thành công!')
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
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    changePassword,
  }
}
