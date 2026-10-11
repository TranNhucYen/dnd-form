'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  AdminTemplate,
  TemplateStatus,
  UpdateTemplateInput,
} from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { getCategoriesAction } from '../../category/actions/category.action'
import {
  getTemplatesAction,
  updateTemplateAction,
} from '../actions/template.action'
import { useDebounce } from '@/features/admin/shared'

export function useTemplate(initialPageSize = 8) {
  const [templates, setTemplates] = useState<AdminTemplate[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TemplateStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 })

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Đưa về trang đầu tiên khi thay đổi ô tìm kiếm hoặc bộ lọc trạng thái
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesAction()
      if (res.success && res.data) {
        setCategories(res.data)
      }
    } catch {
      // Bỏ qua lỗi danh mục nếu đã tải trước đó
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getTemplatesAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
      })

      if (res.success && res.data) {
        setTemplates(res.data.items)
        setTotalItems(res.data.totalItems)
        setTotalPages(res.data.totalPages)
        setCounts(res.data.counts)
      } else {
        setError(res.error)
        toast.error(res.error)
      }
    } catch {
      const errorMsg = 'Không thể tải danh sách biểu mẫu mẫu.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, statusFilter])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const updateTemplate = async (id: number, data: UpdateTemplateInput) => {
    // Cập nhật giao diện trước khi gọi API (Optimistic update)
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
      const res = await updateTemplateAction(id, data)
      if (!res.success) {
        toast.error(res.error)
        fetchTemplates()
      } else if (res.data) {
        await fetchTemplates()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi cập nhật biểu mẫu mẫu.')
      fetchTemplates()
    }
  }

  return {
    templates,
    categories,
    filteredTemplates: templates,
    paginatedTemplates: templates,
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
