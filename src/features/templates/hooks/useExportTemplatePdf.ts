'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { slugify } from '@/lib/slug'

/**
 * Hook tải file PDF biểu mẫu từ server.
 */
export function useExportTemplatePdf() {
  const [isExporting, setIsExporting] = useState(false)

  const downloadPdf = useCallback(async (id: number | string, name?: string) => {
    if (!id) return

    try {
      setIsExporting(true)
      toast.info('Đang kết xuất tài liệu PDF chuẩn xác...')

      const response = await fetch(`/api/templates/${id}/export-pdf`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Không thể xuất file PDF')
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Tạo link tạm để kích hoạt tải file
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = `${slugify(name) || 'mau-bieu-mau'}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000)

      toast.success('Đã tải xuống file PDF thành công!')
    } catch (err) {
      console.error('Lỗi khi xuất PDF:', err)
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xuất file PDF')
    } finally {
      setIsExporting(false)
    }
  }, [])

  return {
    isExporting,
    downloadPdf,
  }
}
