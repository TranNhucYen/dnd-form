'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { slugify } from '@/lib/slug'

/**
 * Hook tải file PDF của biểu mẫu người dùng từ server.
 */
export function useExportFormPdf() {
  const [isExporting, setIsExporting] = useState(false)

  const downloadPdf = useCallback(async (id: number | string, name?: string) => {
    if (!id) return

    const toastId = toast.loading('Đang tải xuống file PDF...')

    try {
      setIsExporting(true)

      const response = await fetch(`/api/forms/${id}/export-pdf`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Không thể xuất file PDF')
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      // Tạo link tạm để kích hoạt tải file về máy
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = `${slugify(name) || 'bieu-mau'}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000)

      toast.success('Đã tải xuống file PDF thành công!', { id: toastId })
    } catch (err) {
      console.error('Lỗi khi xuất PDF:', err)
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải xuống file PDF', { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }, [])

  const downloadPdfsZip = useCallback(async (formIds: number[]) => {
    if (formIds.length < 2) return

    const toastId = toast.loading('Đang tạo PDF và đóng gói file ZIP...')
    try {
      setIsExporting(true)
      const response = await fetch('/api/forms/export-pdf-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formIds }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Không thể xuất file ZIP PDF')
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = 'bieu-mau-pdf.zip'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000)
      toast.success('Đã tải xuống file ZIP thành công!', { id: toastId })
    } catch (err) {
      console.error('Lỗi khi xuất ZIP PDF:', err)
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải file ZIP', { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }, [])

  return {
    isExporting,
    downloadPdf,
    downloadPdfsZip,
  }
}
