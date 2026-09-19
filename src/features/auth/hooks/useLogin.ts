'use client'

import { useState } from 'react'
import { loginAction } from '../actions/auth.action'
import { AuthUser, UserLogin } from '../types/auth.type'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: UserLogin): Promise<AuthUser | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginAction(data)

      if (!response.success) {
        setError(response.error || 'Đăng nhập thất bại.')
        return null
      }

      return response.data ?? null
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    error,
    setError,
  }
}