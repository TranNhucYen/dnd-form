'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  AdminTemplate,
  Category,
  TemplateStatus,
  UpdateTemplateInput,
} from '../types/template.type'
import {
  getCategoriesAction,
  getTemplatesAction,
  updateTemplateAction,
} from '../actions/template.action'

export function useTemplate(initialPageSize = 8) {
  const [templates, setTemplates] = useState<AdminTemplate[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TemplateStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [templatesData, categoriesData] = await Promise.all([
        getTemplatesAction(),
        getCategoriesAction(),
      ])
      setTemplates(templatesData)
      setCategories(categoriesData)
    } catch {
      setError('Không thể tải danh sách biểu mẫu mẫu.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Đếm số lượng biểu mẫu theo từng trạng thái duyệt cho các tab
  const counts = useMemo(() => {
    return {
      all: templates.length,
      pending: templates.filter((t) => t.review_status === TemplateStatus.PENDING).length,
      approved: templates.filter((t) => t.review_status === TemplateStatus.APPROVED).length,
      rejected: templates.filter((t) => t.review_status === TemplateStatus.REJECTED).length,
    }
  }, [templates])

  // Lọc danh sách biểu mẫu theo trạng thái duyệt và từ khóa tìm kiếm
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return templates.filter((t) => {
      const matchesStatus =
        statusFilter === 'all' || t.review_status === statusFilter

      if (!matchesStatus) return false
      if (!q) return true

      return (
        t.title.toLowerCase().includes(q) ||
        t.creatorName.toLowerCase().includes(q) ||
        String(t.id).toLowerCase().includes(q) ||
        (t.category?.name ? t.category.name.toLowerCase().includes(q) : false)
      )
    })
  }, [templates, statusFilter, searchQuery])

  // Đưa về trang đầu tiên khi thay đổi ô tìm kiếm hoặc bộ lọc trạng thái
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const totalItems = filteredTemplates.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTemplates.slice(start, start + pageSize)
  }, [filteredTemplates, currentPage, pageSize])

  const updateTemplate = async (id: number, data: UpdateTemplateInput) => {
    // Cập nhật giao diện trước khi gọi API
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        let updatedCategory = data.category
        if (data.categoryId && !updatedCategory) {
          updatedCategory = categories.find((c) => c.id === data.categoryId)
        }
        return {
          ...t,
          ...data,
          ...(updatedCategory ? { category: updatedCategory, categoryId: updatedCategory.id } : {}),
        }
      })
    )

    try {
      await updateTemplateAction(id, data)
    } catch {
      fetchTemplates()
    }
  }

  return {
    templates,
    categories,
    filteredTemplates,
    paginatedTemplates,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    counts,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    updateTemplate,
    refetch: fetchTemplates,
  }
}
