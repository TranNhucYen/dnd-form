'use client'

import { useState } from 'react'
import { registerAction } from '../actions/auth.action'
import { AuthUser, UserRegister } from '../types/auth.type'

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (data: UserRegister): Promise<AuthUser | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await registerAction(data)

      if (!response.success) {
        setError(response.error || 'Đăng ký thất bại')
        return null
      }

      return response.data ?? null
    } catch {
      setError('Không thể kết nối đến máy chủ')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    isLoading,
    error,
    setError,
  }
}
