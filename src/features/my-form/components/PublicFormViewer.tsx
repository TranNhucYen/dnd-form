'use client'

import { useEffect } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { FormCanvas } from '@/features/form-builder/canvas/FormCanvas'
import { VerticalPageSelector } from '@/features/form-builder/page-tab/VerticalPageSelector'
import { useFormBuilderStore } from '@/features/form-builder/store/useFormBuilderStore'
import type { PublicFormDetail } from '../types/my-form.type'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

interface PublicFormViewerProps {
  form: PublicFormDetail
}

export function PublicFormViewer({ form }: PublicFormViewerProps) {
  const loadFormSchema = useFormBuilderStore((state) => state.loadFormSchema)
  const resetForm = useFormBuilderStore((state) => state.resetForm)
  const setIsReadOnly = useFormBuilderStore((state) => state.setIsReadOnly)

  useEffect(() => {
    setIsReadOnly(true)
    if (form.schemaContent) {
      loadFormSchema(form.schemaContent)
    }
    return () => {
      resetForm()
    }
  }, [form.schemaContent, loadFormSchema, resetForm, setIsReadOnly])

  const handlePrint = () => {
    window.print()
  }

  return (
    <DragDropProvider>
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        {/* Thanh công cụ xem công khai */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shadow-2xs print:hidden">
          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-bold text-neutral-900 truncate">
              {form.name}
            </h1>
            {form.description && (
              <p className="text-xs text-neutral-500 truncate">{form.description}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="cursor-pointer gap-2 shrink-0"
          >
            <Printer className="size-4" />
            <span>In / Lưu PDF</span>
          </Button>
        </header>

        {/* Khung hiển thị Canvas */}
        <main className="flex-1 flex justify-center p-6 md:p-10 overflow-auto">
          <div className="relative self-start flex items-start gap-4">
            <div className="relative shadow-xl rounded-sm">
              <FormCanvas />
              {/* Lớp phủ trong suốt ngăn tương tác kéo thả trong chế độ xem công khai */}
              <div className="absolute inset-0 z-50 bg-transparent cursor-default" />
            </div>
            {/* Thanh chọn trang bên phải phía dưới trang giấy */}
            <VerticalPageSelector className="sticky top-[55%] -translate-y-1/2" />
          </div>
        </main>
      </div>
    </DragDropProvider>
  )
}
