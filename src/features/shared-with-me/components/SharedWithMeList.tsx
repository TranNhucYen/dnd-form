'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchInput, EmptyState, ErrorAlert } from '@/shared/components'
import { useSharedWithMe } from '../hooks/useSharedWithMe'
import { SharedWithMeTable } from './SharedWithMeTable'

export default function SharedWithMeList() {
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
    refetch,
  } = useSharedWithMe()

  return (
    <div className="w-full mx-auto flex flex-col gap-4 sm:gap-5 h-[calc(100svh-5rem)]">
      {/* Header section */}
      <div
        className="shrink-0 flex flex-col sm:flex-row justify-between items-start
        sm:items-center w-full border-b border-border pb-3.5 gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chia sẻ với tôi</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Danh sách các biểu mẫu được người dùng khác chia sẻ quyền truy cập với bạn.
          </p>
        </div>
      </div>

      {/* Search section */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <SearchInput
          wrapperClassName="w-full sm:w-96"
          placeholder="Tìm kiếm theo tên biểu mẫu hoặc người chia sẻ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <span className="text-xs text-muted-foreground self-end sm:self-center">
          Tổng số: <strong className="font-semibold text-foreground">{totalItems}</strong> biểu mẫu
        </span>
      </div>

      {/* Error state */}
      <ErrorAlert error={error} onRetry={refetch} className="shrink-0" />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex-1 min-h-[260px] rounded-xl border border-border bg-card p-4 flex flex-col gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-64 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && forms.length === 0 && (
        <EmptyState
          className="flex-1 min-h-[260px] py-12"
          icon={FolderOpen}
          title={searchTerm ? 'Không tìm thấy biểu mẫu phù hợp' : 'Chưa có biểu mẫu nào được chia sẻ'}
          description={
            searchTerm
              ? `Không tìm thấy kết quả khớp với "${searchTerm}". Hãy thử kiểm tra lại từ khóa.`
              : 'Hiện tại chưa có ai chia sẻ biểu mẫu nào với bạn.'
          }
        />
      )}

      {/* Forms Table & Pagination */}
      {!isLoading && !error && forms.length > 0 && (
        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          <SharedWithMeTable forms={forms} />

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
    </div>
  )
}
