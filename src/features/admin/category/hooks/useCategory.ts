'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Category } from '../types/category.type'
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '../actions/category.action'

export const ADMIN_CATEGORIES_KEY = ['admin', 'categories'] as const

export function useCategory(initialPageSize = 5) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Tải danh sách loại biểu mẫu từ Server Action
  const categoriesQuery = useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: async (): Promise<Category[]> => {
      const res = await getCategoriesAction()
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Không thể tải danh sách loại biểu mẫu.')
      }
      return res.data
    },
  })

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data]
  )

  const fetchCategories = categoriesQuery.refetch

  const setCategories = useCallback(
    (updater: (prev: Category[]) => Category[]) => {
      queryClient.setQueryData<Category[]>(ADMIN_CATEGORIES_KEY, (prev) =>
        updater(prev ?? [])
      )
    },
    [queryClient]
  )

  // Lọc danh sách theo từ khóa tìm kiếm (tên hoặc slug)
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return categories

    return categories.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q)
      )
    })
  }, [categories, searchQuery])

  // Reset về trang 1 khi thay đổi từ khóa tìm kiếm
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalItems = filteredCategories.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Phân trang danh sách loại biểu mẫu
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCategories.slice(start, start + pageSize)
  }, [filteredCategories, currentPage, pageSize])

  // Thêm mới loại biểu mẫu
  const createCategory = async (name: string) => {
    try {
      const res = await createCategoryAction({ name })
      if (!res.success) {
        fetchCategories()
        throw new Error(res.error)
      }
      setCategories((prev) => [res.data, ...prev])
      return res.data
    } catch (err) {
      fetchCategories()
      throw err
    }
  }

  // Cập nhật tên loại biểu mẫu
  const updateCategory = async (id: number, name: string) => {
    // Cập nhật giao diện trước (optimistic update)
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c))
    )

    try {
      const res = await updateCategoryAction(id, { name })
      if (!res.success) {
        fetchCategories()
        throw new Error(res.error)
      }
      if (res.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? res.data! : c))
        )
      }
      return res.data
    } catch (err) {
      fetchCategories()
      throw err
    }
  }

  // Xóa loại biểu mẫu
  const deleteCategory = async (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    try {
      const res = await deleteCategoryAction(id)
      if (!res.success) {
        fetchCategories()
        throw new Error(res.error)
      }
    } catch (err) {
      fetchCategories()
      throw err
    }
  }

  return {
    categories,
    filteredCategories,
    paginatedCategories,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error?.message ?? null,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}
