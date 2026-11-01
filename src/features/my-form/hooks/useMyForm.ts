'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { MyForm, CreateBlankFormInput } from '../types/my-form.type'
import {
  getMyFormsAction,
  createBlankFormAction,
  duplicateFormAction,
  deleteFormAction,
} from '../actions/my-form.action'

export const MY_FORM_LIST_KEY = ['my-form', 'list'] as const

async function fetchMyForms(): Promise<MyForm[]> {
  const res = await getMyFormsAction()
  if (!res.success || !res.data) {
    throw new Error(res.error || 'Không thể tải danh sách biểu mẫu')
  }
  return res.data
}

export function useMyFormList() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTermState] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const myFormsQuery = useQuery({
    queryKey: MY_FORM_LIST_KEY,
    queryFn: fetchMyForms,
  })

  useEffect(() => {
    if (myFormsQuery.error) {
      toast.error(myFormsQuery.error.message)
    }
  }, [myFormsQuery.error])

  const updateLocalList = useCallback(
    (updater: (prev: MyForm[]) => MyForm[]) => {
      queryClient.setQueryData<MyForm[]>(MY_FORM_LIST_KEY, (prev) =>
        updater(prev ?? [])
      )
    },
    [queryClient]
  )

  // Trang chủ hiển thị số lượng và biểu mẫu gần đây nên cần làm mới sau khi thay đổi.
  const invalidateHome = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['home'] })
  }, [queryClient])

  // Đổi từ khóa tìm kiếm và tự động reset về trang 1 trong event handler
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
    setCurrentPage(1)
  }, [])

  const data = useMemo(() => myFormsQuery.data ?? [], [myFormsQuery.data])

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
      updateLocalList((prev) => [res.data!, ...prev])
      invalidateHome()
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
        updateLocalList((prev) => [res.data!, ...prev])
        invalidateHome()
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
        updateLocalList((prev) => prev.filter((f) => f.id !== id))
        invalidateHome()
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
    isLoading: myFormsQuery.isLoading,
    error: myFormsQuery.error?.message ?? null,
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
    refetch: myFormsQuery.refetch,
  }
}
