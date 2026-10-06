'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminPaginationProps } from '../../types/pagination.type'
import { cn } from '@/lib/utils'

function getPaginationRange(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export function AdminPagination({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  itemName = 'bản ghi',
}: AdminPaginationProps) {
  if (totalItems === 0) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  const paginationRange = getPaginationRange(currentPage, totalPages)

  return (
    <div
      className="
        shrink-0 border-t bg-card/60 backdrop-blur-xs px-3 py-2.5
        flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground"
    >
      {/* Thống kê số lượng & Bộ chọn số dòng */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span>
          Hiển thị{' '}
          <strong className="font-semibold text-foreground">{startItem}</strong>
          -
          <strong className="font-semibold text-foreground">{endItem}</strong>{' '}
          trên tổng số{' '}
          <strong className="font-semibold text-foreground">{totalItems}</strong>{' '}
          {itemName}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="hidden md:inline text-[11px]">Mỗi trang:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                onPageSizeChange(Number(val))
                onPageChange(1)
              }}
            >
              <SelectTrigger className="h-7 w-[68px] text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Điều hướng các trang */}
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1">
          {/* Nút Trước */}
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={cn(
                'cursor-pointer text-xs h-8 px-2.5',
                currentPage <= 1 && 'pointer-events-none opacity-50'
              )}
              text="Trước"
            />
          </PaginationItem>

          {/* Dải số trang với Ellipsis */}
          {paginationRange.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`} className="hidden sm:inline-block">
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={page} className="hidden sm:inline-block">
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(page)
                  }}
                  isActive={currentPage === page}
                  className="cursor-pointer text-xs size-8"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {/* Mobile view: Chỉ hiển thị text Trang X / Y */}
          <li className="sm:hidden text-xs px-2 font-medium text-foreground">
            {currentPage} / {totalPages}
          </li>

          {/* Nút Sau */}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) onPageChange(currentPage + 1)
              }}
              className={cn(
                'cursor-pointer text-xs h-8 px-2.5',
                currentPage >= totalPages && 'pointer-events-none opacity-50'
              )}
              text="Sau"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
