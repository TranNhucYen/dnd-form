'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Category } from '../types/category.type'
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '../actions/category.action'

export function useCategory(initialPageSize = 5) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Tải danh sách loại biểu mẫu từ Server Action
  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getCategoriesAction()
      if (res.success) {
        setCategories(res.data)
      } else {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách loại biểu mẫu.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}
