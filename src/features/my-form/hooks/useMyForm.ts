'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  MyForm,
  CreateFormInput,
  UpdateFormInput,
  FormStatus,
  SharedUser,
} from '../types/my-form.type'
import {
  getMyFormsAction,
  createFormAction,
  updateFormAction,
  deleteFormAction,
  duplicateFormAction,
  updateFormStatusAction,
  updateFormSharingAction,
} from '../actions/my-form.action'

export function useMyFormList() {
  const [data, setData] = useState<MyForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const fetchForms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getMyFormsAction()
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchForms()
  }, [fetchForms])

  // Reset về trang 1 khi đổi bộ lọc tìm kiếm hoặc trạng thái
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  const counts = useMemo(() => {
    return {
      all: data.length,
      active: data.filter((f) => f.status === FormStatus.ACTIVE).length,
      draft: data.filter((f) => f.status === FormStatus.DRAFT).length,
      archived: data.filter((f) => f.status === FormStatus.ARCHIVED).length,
    }
  }, [data])

  const filteredForms = useMemo(() => {
    return data.filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (form.sourceTemplateName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesStatus =
        selectedStatus === 'all' || form.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [data, searchTerm, selectedStatus])

  const totalItems = filteredForms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedForms = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredForms.slice(start, start + pageSize)
  }, [filteredForms, currentPage, pageSize])

  const createForm = async (input: CreateFormInput) => {
    const newForm = await createFormAction(input)
    setData((prev) => [newForm, ...prev])
    return newForm
  }

  const updateForm = async (id: number, input: UpdateFormInput) => {
    const updated = await updateFormAction(id, input)
    if (updated) {
      setData((prev) => prev.map((f) => (f.id === id ? updated : f)))
    }
    return updated
  }

  const updateStatus = async (id: number, status: FormStatus) => {
    const updated = await updateFormStatusAction(id, status)
    if (updated) {
      setData((prev) => prev.map((f) => (f.id === id ? updated : f)))
    }
    return updated
  }

  const duplicateForm = async (
    id: number,
    customData?: { title?: string; description?: string }
  ) => {
    const duplicated = await duplicateFormAction(id, customData)
    if (duplicated) {
      setData((prev) => [duplicated, ...prev])
    }
    return duplicated
  }

  const deleteForm = async (id: number) => {
    const success = await deleteFormAction(id)
    if (success) {
      setData((prev) => prev.filter((f) => f.id !== id))
    }
    return success
  }

  const updateSharing = async (
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ) => {
    const updated = await updateFormSharingAction(id, sharing)
    if (updated) {
      setData((prev) => prev.map((f) => (f.id === id ? updated : f)))
    }
    return updated
  }

  return {
    forms: paginatedForms,
    allFilteredForms: filteredForms,
    rawForms: data,
    counts,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    createForm,
    updateForm,
    updateStatus,
    duplicateForm,
    deleteForm,
    updateSharing,
    refetch: fetchForms,
  }
}
