'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { SharedWithMeItem } from '../types/shared-with-me.type'
import { getSharedWithMeAction } from '../actions/shared-with-me.action'

async function fetchSharedForms(): Promise<SharedWithMeItem[]> {
  const res = await getSharedWithMeAction()
  if (!res.success || !res.data) {
    throw new Error(
      res.error || 'Không thể tải danh sách biểu mẫu được chia sẻ'
    )
  }
  return res.data
}

export function useSharedWithMe() {
  const [searchTerm, setSearchTermState] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const sharedFormsQuery = useQuery({
    queryKey: ['shared-with-me', 'list'] as const,
    queryFn: fetchSharedForms,
  })

  useEffect(() => {
    if (sharedFormsQuery.error) {
      toast.error(sharedFormsQuery.error.message)
    }
  }, [sharedFormsQuery.error])

  const data = useMemo(() => sharedFormsQuery.data ?? [], [sharedFormsQuery.data])

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
    isLoading: sharedFormsQuery.isLoading,
    error: sharedFormsQuery.error?.message ?? null,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    refetch: sharedFormsQuery.refetch,
  }
}
