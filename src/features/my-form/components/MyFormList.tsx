'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Plus, Search, RefreshCw, AlertCircle, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useMyFormList } from '../hooks/useMyForm'
import type { MyForm } from '../types/my-form.type'
import { saveFormSharingAction } from '../actions/my-form.action'
import { MyFormTable } from './MyFormTable'
import { CreateFormModal } from './CreateFormModal'
import { DuplicateFormModal } from './DuplicateFormModal'
import { ShareFormModal } from './ShareFormModal'
import { PreviewFormModal } from './PreviewFormModal'
import { DeleteFormModal } from './DeleteFormModal'

export default function MyFormList() {
  const {
    forms,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    createBlankForm,
    duplicateForm,
    deleteForm,
    refetch,
  } = useMyFormList()

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [duplicateModalForm, setDuplicateModalForm] = useState<MyForm | null>(null)
  const [shareModalForm, setShareModalForm] = useState<MyForm | null>(null)
  const [previewModalForm, setPreviewModalForm] = useState<MyForm | null>(null)
  const [deleteModalForm, setDeleteModalForm] = useState<MyForm | null>(null)

  return (
    <div className="w-full mx-auto flex flex-col gap-4 sm:gap-5 h-[calc(100svh-5rem)]">
      {/* Header section */}
      <div
        className="shrink-0 flex flex-col sm:flex-row justify-between items-start
        sm:items-center w-full border-b border-border pb-3.5 gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Biểu mẫu của tôi</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Quản lý, chỉnh sửa, phân quyền chia sẻ và theo dõi các biểu mẫu của bạn.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="cursor-pointer shrink-0"
        >
          <Plus data-icon="inline-start" />
          Tạo biểu mẫu mới
        </Button>
      </div>

      {/* Search section */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2
            size-4 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm theo tên hoặc mô tả biểu mẫu..."
            className="pl-9 h-9 text-xs focus-visible:ring-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <span className="text-xs text-muted-foreground self-end sm:self-center">
          Tổng số: <strong className="font-semibold text-foreground">{totalItems}</strong> biểu mẫu
        </span>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle />
            <div>
              <AlertTitle>Đã có lỗi xảy ra</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="cursor-pointer text-xs shrink-0"
          >
            <RefreshCw data-icon="inline-start" />
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex-1 min-h-[260px] rounded-xl border border-border bg-card p-4 flex flex-col gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2
              border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-64 rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && forms.length === 0 && (
        <div
          className="flex-1 min-h-[260px]
          flex flex-col items-center justify-center py-12 px-4
          border border-dashed border-border rounded-xl bg-muted/20 text-center"
        >
          <FolderOpen className="size-12 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">
            {searchTerm ? 'Không tìm thấy biểu mẫu phù hợp' : 'Chưa có biểu mẫu nào'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchTerm
              ? `Không tìm thấy kết quả khớp với "${searchTerm}". Hãy thử kiểm tra lại từ khóa.`
              : 'Bạn chưa tạo biểu mẫu nào. Hãy bắt đầu tạo biểu mẫu đầu tiên của bạn!'}
          </p>

          {!searchTerm && (
            <Button
              size="sm"
              className="mt-4 text-xs cursor-pointer"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus data-icon="inline-start" />
              Tạo biểu mẫu mới
            </Button>
          )}
        </div>
      )}

      {/* Forms Table & Pagination */}
      {!isLoading && !error && forms.length > 0 && (
        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          <MyFormTable
            forms={forms}
            onOpenPreview={(form) => setPreviewModalForm(form)}
            onOpenShare={(form) => setShareModalForm(form)}
            onOpenDelete={(form) => setDeleteModalForm(form)}
            onOpenDuplicate={(form) => setDuplicateModalForm(form)}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              className="shrink-0 flex flex-col sm:flex-row items-center
              justify-between gap-3 pt-1 text-xs text-muted-foreground"
            >
              <span>
                Hiển thị{' '}
                <strong className="font-semibold text-foreground">
                  {(currentPage - 1) * pageSize + 1}
                </strong>
                -
                <strong className="font-semibold text-foreground">
                  {Math.min(currentPage * pageSize, totalItems)}
                </strong>{' '}
                trên tổng số{' '}
                <strong className="font-semibold text-foreground">
                  {totalItems}
                </strong>{' '}
                biểu mẫu
              </span>

              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className={cn(
                        'cursor-pointer text-xs h-8',
                        currentPage === 1 && 'pointer-events-none opacity-50'
                      )}
                      text="Trước"
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer text-xs size-8"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={cn(
                        'cursor-pointer text-xs h-8',
                        currentPage === totalPages && 'pointer-events-none opacity-50'
                      )}
                      text="Sau"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateBlank={createBlankForm}
      />

      <DuplicateFormModal
        form={duplicateModalForm}
        open={!!duplicateModalForm}
        onOpenChange={(open) => !open && setDuplicateModalForm(null)}
        onConfirmDuplicate={duplicateForm}
      />

      <ShareFormModal
        form={shareModalForm}
        open={!!shareModalForm}
        onOpenChange={(open) => !open && setShareModalForm(null)}
        onUpdateSharing={async (id, sharing) => {
          const res = await saveFormSharingAction(id, {
            isPublic: sharing.isPublic,
            sharedUsers: sharing.sharedWith.map((u) => ({
              email: u.email,
              role: u.role,
            })),
          })
          if (!res.success) {
            toast.error(res.error || 'Lưu cài đặt chia sẻ thất bại')
            throw new Error(res.error)
          }
          toast.success('Đã cập nhật cài đặt chia sẻ thành công')
          refetch()
        }}
      />

      <PreviewFormModal
        form={previewModalForm}
        open={!!previewModalForm}
        onOpenChange={(open) => !open && setPreviewModalForm(null)}
      />

      <DeleteFormModal
        form={deleteModalForm}
        open={!!deleteModalForm}
        onOpenChange={(open) => !open && setDeleteModalForm(null)}
        onConfirmDelete={deleteForm}
      />
    </div>
  )
}
