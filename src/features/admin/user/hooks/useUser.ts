'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { User, CreateUserInput, UserRole, UserStatus } from '../types/user.type'
import {
  getUsersAction,
  updateUserStatusAction,
  createUserAction,
} from '../actions/user.action'

export function useUser(initialPageSize = 8) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getUsersAction()
      if (res.success) {
        setUsers(res.data)
      } else {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return users

    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.id).toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    )
  }, [users, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalItems = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage, pageSize])

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
      setUsers((prev) => [res.data, ...prev])
      return res.data
    } catch (err) {
      throw err
    }
  }

  return {
    users,
    filteredUsers,
    paginatedUsers,
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
