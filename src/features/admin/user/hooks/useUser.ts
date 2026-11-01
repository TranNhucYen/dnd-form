'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { User, CreateUserInput, UserRole, UserStatus } from '../types/user.type'
import {
  getUsersAction,
  updateUserStatusAction,
  createUserAction,
} from '../actions/user.action'
import { useDebounce } from '@/features/admin/shared'

interface AdminUserPage {
  items: User[]
  totalItems: number
  totalPages: number
}

const EMPTY_USER_PAGE: AdminUserPage = {
  items: [],
  totalItems: 0,
  totalPages: 1,
}

export const adminUsersKey = (page: number, pageSize: number, search: string) =>
  ['admin', 'users', { page, pageSize, search }] as const

export function useUser(initialPageSize = 8) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset về trang 1 khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  const usersQuery = useQuery({
    queryKey: adminUsersKey(currentPage, pageSize, debouncedSearch),
    queryFn: async (): Promise<AdminUserPage> => {
      const res = await getUsersAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
      })
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Không thể tải danh sách người dùng')
      }
      return {
        items: res.data.items,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
      }
    },
  })

  useEffect(() => {
    if (usersQuery.error) {
      toast.error(usersQuery.error.message)
    }
  }, [usersQuery.error])

  const data = usersQuery.data ?? EMPTY_USER_PAGE
  const refetch = usersQuery.refetch

  const setData = useCallback(
    (updater: (prev: AdminUserPage) => AdminUserPage) => {
      queryClient.setQueryData<AdminUserPage>(
        adminUsersKey(currentPage, pageSize, debouncedSearch),
        (prev) => updater(prev ?? EMPTY_USER_PAGE)
      )
    },
    [queryClient, currentPage, pageSize, debouncedSearch]
  )

  const handleStatusChange = async (id: number, newStatus: UserStatus) => {
    // Optimistic update
    setData((prev) => ({
      ...prev,
      items: prev.items.map((user) => {
        if (user.id !== id) return user
        if (
          user.role === UserRole.SUPER_ADMIN &&
          newStatus === UserStatus.BLOCKED
        ) {
          return user
        }
        return { ...user, status: newStatus }
      }),
    }))

    try {
      const res = await updateUserStatusAction(id, newStatus)
      if (!res.success) {
        void refetch()
      }
    } catch {
      void refetch()
    }
  }

  const addUser = async (input: CreateUserInput) => {
    const res = await createUserAction(input)
    if (!res.success) {
      throw new Error(res.error)
    }
    await refetch()
    return res.data
  }

  return {
    users: data.items,
    filteredUsers: data.items,
    paginatedUsers: data.items,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error?.message ?? null,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages: data.totalPages,
    totalItems: data.totalItems,
    handleStatusChange,
    addUser,
    refetch,
  }
}
