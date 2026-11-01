'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  AdminTemplate,
  TemplateStatus,
  TemplateCounts,
  UpdateTemplateInput,
} from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { getCategoriesAction } from '../../category/actions/category.action'
import {
  getTemplatesAction,
  updateTemplateAction,
} from '../actions/template.action'
import { useDebounce } from '@/features/admin/shared'

interface AdminTemplatePage {
  items: AdminTemplate[]
  totalItems: number
  totalPages: number
  counts: TemplateCounts
}

const EMPTY_TEMPLATE_PAGE: AdminTemplatePage = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  counts: { all: 0, pending: 0, approved: 0, rejected: 0 },
}

export function useTemplate(initialPageSize = 8) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TemplateStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Đưa về trang đầu tiên khi thay đổi ô tìm kiếm hoặc bộ lọc trạng thái
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter])

  // Dùng chung key với useCategory để không gọi lại API danh mục
  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories'] as const,
    queryFn: async (): Promise<Category[]> => {
      const res = await getCategoriesAction()
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Không thể tải danh mục biểu mẫu.')
      }
      return res.data
    },
  })

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data]
  )

  const templatesQuery = useQuery({
    queryKey: [
      'admin',
      'templates',
      {
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
      },
    ] as const,
    queryFn: async (): Promise<AdminTemplatePage> => {
      const res = await getTemplatesAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
      })

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Không thể tải danh sách biểu mẫu mẫu.')
      }

      return {
        items: res.data.items,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
        counts: res.data.counts,
      }
    },
  })

  useEffect(() => {
    if (templatesQuery.error) {
      toast.error(templatesQuery.error.message)
    }
  }, [templatesQuery.error])

  const templatePage = templatesQuery.data ?? EMPTY_TEMPLATE_PAGE
  const fetchTemplates = templatesQuery.refetch

  const setTemplatePage = useCallback(
    (updater: (prev: AdminTemplatePage) => AdminTemplatePage) => {
      queryClient.setQueryData<AdminTemplatePage>(
        [
          'admin',
          'templates',
          {
            page: currentPage,
            pageSize,
            search: debouncedSearch,
            status: statusFilter,
          },
        ],
        (prev) => updater(prev ?? EMPTY_TEMPLATE_PAGE)
      )
    },
    [queryClient, currentPage, pageSize, debouncedSearch, statusFilter]
  )

  const updateTemplate = async (id: number, data: UpdateTemplateInput) => {
    // Cập nhật giao diện trước khi gọi API (Optimistic update)
    setTemplatePage((prev) => ({
      ...prev,
      items: prev.items.map((t) => {
        if (t.id !== id) return t
        let updatedCategory = data.category
        if (data.categoryId && !updatedCategory) {
          updatedCategory = categories.find((c) => c.id === data.categoryId)
        }
        return {
          ...t,
          ...data,
          ...(updatedCategory
            ? { category: updatedCategory, categoryId: updatedCategory.id }
            : {}),
        }
      }),
    }))

    try {
      const res = await updateTemplateAction(id, data)
      if (!res.success) {
        toast.error(res.error)
        await fetchTemplates()
      } else if (res.data) {
        await fetchTemplates()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi cập nhật biểu mẫu mẫu.')
      await fetchTemplates()
    }
  }

  return {
    templates: templatePage.items,
    categories,
    filteredTemplates: templatePage.items,
    paginatedTemplates: templatePage.items,
    isLoading: templatesQuery.isLoading,
    error: templatesQuery.error?.message ?? null,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    counts: templatePage.counts,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages: templatePage.totalPages,
    totalItems: templatePage.totalItems,
    updateTemplate,
    refetch: fetchTemplates,
  }
}
