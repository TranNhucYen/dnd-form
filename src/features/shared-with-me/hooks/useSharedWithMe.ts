'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { SharedWithMeItem } from '../types/shared-with-me.type'
import { getSharedWithMeAction } from '../actions/shared-with-me.action'

export function useSharedWithMe() {
  const [data, setData] = useState<SharedWithMeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTermState] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Tải danh sách khi component mount
  useEffect(() => {
    let ignore = false

    getSharedWithMeAction()
      .then((res) => {
        if (ignore) return
        if (res.success && res.data) {
          setData(res.data)
        } else {
          const errorMsg = res.error || 'Không thể tải danh sách biểu mẫu được chia sẻ'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      })
      .catch((err) => {
        if (ignore) return
        const errorMsg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra'
        setError(errorMsg)
        toast.error(errorMsg)
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Hàm làm mới danh sách chủ động
  const fetchSharedForms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getSharedWithMeAction()
      if (res.success && res.data) {
        setData(res.data)
      } else {
        const errorMsg = res.error || 'Không thể tải danh sách biểu mẫu được chia sẻ'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Thay đổi từ khóa tìm kiếm và tự động reset về trang 1
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
    setCurrentPage(1)
  }, [])

  const filteredForms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return data

    return data.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(term)
      const matchesDescription =
        item.description?.toLowerCase().includes(term) ?? false
      const matchesOwnerName =
        item.ownerName.toLowerCase().includes(term)
      const matchesOwnerEmail =
        item.ownerEmail.toLowerCase().includes(term)

      return matchesName || matchesDescription || matchesOwnerName || matchesOwnerEmail
    })
  }, [data, searchTerm])

  const totalItems = filteredForms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedForms = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredForms.slice(start, start + pageSize)
  }, [filteredForms, currentPage, pageSize])

  return {
    forms: paginatedForms,
    allFilteredForms: filteredForms,
    rawForms: data,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    refetch: fetchSharedForms,
  }
}
