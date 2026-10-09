'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, CreateUserInput, UserRole, UserStatus } from '../types/user.type'
import {
  getUsersAction,
  updateUserStatusAction,
  createUserAction,
} from '../actions/user.action'
import { useDebounce } from '@/features/admin/shared'

export function useUser(initialPageSize = 8) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset về trang 1 khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getUsersAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
      })
      if (res.success && res.data) {
        setUsers(res.data.items)
        setTotalItems(res.data.totalItems)
        setTotalPages(res.data.totalPages)
      } else {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleStatusChange = async (id: number, newStatus: UserStatus) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user
        if (
          user.role === UserRole.SUPER_ADMIN &&
          newStatus === UserStatus.BLOCKED
        ) {
          return user
        }
        return { ...user, status: newStatus }
      })
    )

    try {
      const res = await updateUserStatusAction(id, newStatus)
      if (!res.success) {
        setError(res.error)
        fetchUsers()
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể cập nhật trạng thái')
      fetchUsers()
    }
  }

  const addUser = async (input: CreateUserInput) => {
    try {
      const res = await createUserAction(input)
      if (!res.success) {
        throw new Error(res.error)
      }
      await fetchUsers()
      return res.data
    } catch (err) {
      throw err
    }
  }

  return {
    users,
    filteredUsers: users,
    paginatedUsers: users,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    handleStatusChange,
    addUser,
    refetch: fetchUsers,
  }
}
