'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Template } from '../types/template.type'
import {
  getTemplatesAction,
  getTemplateByIdAction,
  useTemplateAction,
} from '../actions/template.action'

export function useTemplateList() {
  const [data, setData] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getTemplatesAction()
      if (res.success) {
        setData(res.data)
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(data
        .map((item) => item.categoryName)
        .filter((c): c is string => Boolean(c))
      )
    )
    return ['all', ...unique]
  }, [data])

  const filteredTemplates = useMemo(() => {
    return data.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (template.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesCategory = selectedCategory === 'all' || template.categoryName === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [data, searchTerm, selectedCategory])

  return {
    templates: filteredTemplates,
    rawTemplates: data,
    categories,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    refetch: fetchTemplates,
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