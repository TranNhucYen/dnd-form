'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { AdminUser, CreateUserInput, UserRole, UserStatus } from '../types/user.type'
import {
  getUsersAction,
  updateUserStatusAction,
  createUserAction,
} from '../actions/user.action'

export function useUser(initialPageSize = 8) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getUsersAction()
      setUsers(data)
    } catch {
      setError('Không thể tải danh sách người dùng.')
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
        u.name.toLowerCase().includes(q) ||
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
      await updateUserStatusAction(id, newStatus)
    } catch {
      fetchUsers()
    }
  }

  const addUser = async (input: CreateUserInput) => {
    try {
      const created = await createUserAction(input)
      setUsers((prev) => [created, ...prev])
      return created
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

export const useUserManager = useUser
