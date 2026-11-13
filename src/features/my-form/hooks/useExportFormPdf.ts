'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { slugify } from '@/lib/slug'

/**
 * Hook tải file PDF của biểu mẫu người dùng từ server.
 */
export function useExportFormPdf() {
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)

  const downloadPdf = useCallback(async (id: number | string, name?: string) => {
    if (!id) return

    const toastId = toast.loading(t('common.downloadPdfLoading'))

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

      toast.success(t('common.downloadPdfSuccess'), { id: toastId })
    } catch (err) {
      console.error('Lỗi khi xuất PDF:', err)
      toast.error(err instanceof Error ? err.message : t('common.downloadPdfError'), { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }, [t])

  const downloadPdfsZip = useCallback(async (formIds: number[]) => {
    if (formIds.length < 2) return

    const toastId = toast.loading(t('common.prepareZipLoading'))
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
      toast.success(t('common.downloadZipSuccess'), { id: toastId })
    } catch (err) {
      console.error('Lỗi khi xuất ZIP PDF:', err)
      toast.error(err instanceof Error ? err.message : t('common.downloadZipError'), { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }, [t])

  return {
    isExporting,
    downloadPdf,
    downloadPdfsZip,
  }
}
