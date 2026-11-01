'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { Template } from '../types/template.type'
import {
  getTemplatesAction,
  getTemplateCategoriesAction,
  getTemplateByIdAction,
  useTemplateAction as applyTemplateAction,
} from '../actions/template.action'
import { useDebounce } from '@/shared/hooks'

const PAGE_SIZE = 25

interface TemplatePage {
  items: Template[]
  hasMore: boolean
  page: number
}

export function useTemplateList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const debouncedSearch = useDebounce(searchTerm, 400)

  const categoriesQuery = useQuery({
    queryKey: ['templates', 'categories'] as const,
    queryFn: async (): Promise<string[]> => {
      const res = await getTemplateCategoriesAction()
      if (!res.success) {
        throw new Error(res.error || 'Không thể tải danh mục mẫu')
      }
      return ['all', ...res.data]
    },
    // Danh mục hiếm thay đổi, giữ cache 5 phút.
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    if (categoriesQuery.error) {
      console.error('Lỗi khi tải danh mục mẫu:', categoriesQuery.error)
    }
  }, [categoriesQuery.error])

  const templatesQuery = useInfiniteQuery({
    queryKey: [
      'templates',
      'list',
      selectedCategory,
      debouncedSearch,
    ] as const,
    queryFn: async ({ pageParam }): Promise<TemplatePage> => {
      const res = await getTemplatesAction({
        page: pageParam,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        categoryName: selectedCategory,
      })
      if (!res.success) {
        throw new Error(res.error)
      }
      return { items: res.data.items, hasMore: res.data.hasMore, page: pageParam }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  })

  useEffect(() => {
    if (templatesQuery.error) {
      console.error('Lỗi khi tải danh sách mẫu:', templatesQuery.error)
    }
  }, [templatesQuery.error])

  const templates = useMemo(
    () => templatesQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [templatesQuery.data]
  )

  const {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = templatesQuery

  // Tải thêm trang khi cuộn đến cuối danh sách
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    void fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const categories = useMemo(
    () => categoriesQuery.data ?? ['all'],
    [categoriesQuery.data]
  )

  return {
    templates,
    categories,
    isLoading: templatesQuery.isLoading,
    isFetchingMore: isFetchingNextPage,
    hasMore: hasNextPage ?? false,
    error: templatesQuery.error?.message ?? null,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    loadMore,
    refetch: templatesQuery.refetch,
  }
}

export function useTemplateDetail(id: number) {
  const queryClient = useQueryClient()
  const [isCopying, setIsCopying] = useState(false)
  const router = useRouter()

  const templateQuery = useQuery({
    queryKey: ['templates', 'detail', id] as const,
    queryFn: async (): Promise<Template> => {
      if (!id || isNaN(id)) throw new Error('Mã biểu mẫu không hợp lệ')
      const res = await getTemplateByIdAction(id)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: Boolean(id) && !isNaN(id),
  })

  useEffect(() => {
    if (templateQuery.error) {
      console.error('Lỗi khi tải chi tiết mẫu:', templateQuery.error)
    }
  }, [templateQuery.error])

  const createFormCopy = async () => {
    if (!templateQuery.data || isCopying) return
    setIsCopying(true)
    try {
      const res = await applyTemplateAction(templateQuery.data.id)
      if (res.success) {
        // Dùng mẫu tạo ra biểu mẫu mới trong "Biểu mẫu của tôi"
        void queryClient.invalidateQueries({ queryKey: ['my-form'] })
        void queryClient.invalidateQueries({ queryKey: ['home'] })
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
    template: templateQuery.data ?? null,
    isLoading: templateQuery.isLoading,
    isCopying,
    error: templateQuery.error?.message ?? null,
    createFormCopy,
    refetch: templateQuery.refetch,
  }
}
