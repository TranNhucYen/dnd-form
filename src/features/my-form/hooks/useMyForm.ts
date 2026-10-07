'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { MyForm, CreateBlankFormInput } from '../types/my-form.type'
import {
  getMyFormsAction,
  createBlankFormAction,
  duplicateFormAction,
  deleteFormAction,
} from '../actions/my-form.action'

export function useMyFormList() {
  const [data, setData] = useState<MyForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTermState] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Tải danh sách biểu mẫu khi component mount
  useEffect(() => {
    let ignore = false

    getMyFormsAction()
      .then((res) => {
        if (ignore) return
        if (res.success && res.data) {
          setData(res.data)
        } else {
          const errorMsg = res.error || 'Không thể tải danh sách biểu mẫu'
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
  const fetchForms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getMyFormsAction()
      if (res.success && res.data) {
        setData(res.data)
      } else {
        const errorMsg = res.error || 'Không thể tải danh sách biểu mẫu'
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

  // Đổi từ khóa tìm kiếm và tự động reset về trang 1 trong event handler
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
    setCurrentPage(1)
  }, [])

  const filteredForms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return data

    return data.filter((form) => {
      const matchesName = form.name.toLowerCase().includes(term)
      const matchesDescription =
        form.description?.toLowerCase().includes(term) ?? false
      const matchesTemplate =
        form.sourceTemplateName?.toLowerCase().includes(term) ?? false

      return matchesName || matchesDescription || matchesTemplate
    })
  }, [data, searchTerm])

  const totalItems = filteredForms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedForms = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredForms.slice(start, start + pageSize)
  }, [filteredForms, currentPage, pageSize])

  const createBlankForm = async (input: CreateBlankFormInput) => {
    try {
      const res = await createBlankFormAction(input)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Không thể tạo biểu mẫu')
      }
      setData((prev) => [res.data!, ...prev])
      toast.success('Tạo biểu mẫu mới thành công')
      return res.data
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tạo biểu mẫu')
      throw err
    }
  }

  const duplicateForm = async (id: number, customName?: string) => {
    try {
      const res = await duplicateFormAction(id, customName)
      if (res.success && res.data) {
        setData((prev) => [res.data!, ...prev])
        toast.success('Nhân bản biểu mẫu thành công')
        return res.data
      } else {
        toast.error(res.error || 'Không thể nhân bản biểu mẫu')
        return null
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi nhân bản biểu mẫu')
      return null
    }
  }

  const deleteForm = async (id: number) => {
    try {
      const res = await deleteFormAction(id)
      if (res.success) {
        setData((prev) => prev.filter((f) => f.id !== id))
        toast.success('Xóa biểu mẫu thành công')
        return true
      } else {
        toast.error(res.error || 'Không thể xóa biểu mẫu')
        return false
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi xóa biểu mẫu')
      return false
    }
  }

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
    createBlankForm,
    duplicateForm,
    deleteForm,
    refetch: fetchForms,
  }
}
