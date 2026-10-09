'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Template } from '../types/template.type'
import {
  getTemplatesAction,
  getTemplateCategoriesAction,
  getTemplateByIdAction,
  useTemplateAction,
} from '../actions/template.action'
import { useDebounce } from '@/shared/hooks'

const PAGE_SIZE = 25

export function useTemplateList() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<string[]>(['all'])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Chặn gọi trùng request khi cuộn nhanh (tránh lặp dữ liệu/trùng key)
  const isFetchingRef = useRef(false)
  // Theo dõi số trang tức thì để fetch trang tiếp theo mà không chờ React re-render
  const pageRef = useRef(1)
  // Kiểm tra còn còn dữ liệu để fetch không
  const hasMoreRef = useRef(false)

  const debouncedSearch = useDebounce(searchTerm, 400)

  // Tải danh mục mẫu một lần
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getTemplateCategoriesAction()
        if (res.success) {
          setCategories(['all', ...res.data])
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục mẫu:', err)
      }
    }
    fetchCategories()
  }, [])

  // Tải trang 1 khi tìm kiếm hoặc đổi danh mục
  const fetchInitialTemplates = useCallback(async () => {
    isFetchingRef.current = true
    setIsLoading(true)
    setError(null)
    pageRef.current = 1
    setPage(1)
    try {
      const res = await getTemplatesAction({
        page: 1,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        categoryName: selectedCategory,
      })
      if (res.success) {
        setTemplates(res.data.items)
        setHasMore(res.data.hasMore)
        hasMoreRef.current = res.data.hasMore
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
    }
  }, [debouncedSearch, selectedCategory])

  useEffect(() => {
    fetchInitialTemplates()
  }, [fetchInitialTemplates])

  // Tải thêm trang tiếp theo khi người dùng cuộn đến cuối danh sách (mỗi lần 25 dòng)
  const loadMore = useCallback(async () => {
    if (isLoading || isFetchingRef.current || !hasMoreRef.current) return

    isFetchingRef.current = true
    setIsFetchingMore(true)
    const nextPage = pageRef.current + 1

    try {
      const res = await getTemplatesAction({
        page: nextPage,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        categoryName: selectedCategory,
      })
      if (res.success) {
        pageRef.current = nextPage
        setPage(nextPage)
        setHasMore(res.data.hasMore)
        hasMoreRef.current = res.data.hasMore

        // Lọc loại bỏ các phần tử trùng lặp khóa id nếu có
        setTemplates((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          const uniqueNewItems = res.data.items.filter((item) => !existingIds.has(item.id))
          return [...prev, ...uniqueNewItems]
        })
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tải thêm biểu mẫu')
    } finally {
      isFetchingRef.current = false
      setIsFetchingMore(false)
    }
  }, [isLoading, debouncedSearch, selectedCategory])

  return {
    templates,
    categories,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    loadMore,
    refetch: fetchInitialTemplates,
  }
}

export function useTemplateDetail(id: number) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCopying, setIsCopying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchTemplate = useCallback(async () => {
    if (!id || isNaN(id)) {
      setIsLoading(false)
      setError('Mã biểu mẫu không hợp lệ')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await getTemplateByIdAction(id)
      if (res.success) {
        setTemplate(res.data)
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTemplate()
  }, [fetchTemplate])

  const createFormCopy = async () => {
    if (!template || isCopying) return
    setIsCopying(true)
    try {
      const res = await useTemplateAction(template.id)
      if (res.success) {
        toast.success('Tạo bản sao biểu mẫu thành công')
        router.push(`/editor?formId=${res.data.formId}`)
      } else {
        if (res.code === 'ACCOUNT_BLOCKED' || res.code === 'UNAUTHORIZED') {
          router.push('/login')
        }
        toast.error(res.error)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tạo bản sao')
    } finally {
      setIsCopying(false)
    }
  }

  return {
    template,
    isLoading,
    isCopying,
    error,
    createFormCopy,
    refetch: fetchTemplate,
  }
}