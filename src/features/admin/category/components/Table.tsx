'use client'

import { useState } from 'react'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { ChartBarStacked, Search, Plus, Pencil } from 'lucide-react'
import { Category } from '../types/category.type'
import { useCategory } from '../hooks/useCategory'
import { Modal } from './Modal'

export function Table() {
  const {
    paginatedCategories,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    createCategory,
    updateCategory,
  } = useCategory()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleOpenCreateModal = () => {
    setSelectedCategory(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const handleSaveCategory = async (name: string, id?: number) => {
    if (id) {
      await updateCategory(id, name)
    } else {
      await createCategory(name)
    }
  }

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col gap-3">
      {/* Tiêu đề trang và các nút tác vụ */}
      <div
        className="
          shrink-0 flex flex-col sm:flex-row items-start sm:items-center
          justify-between gap-3 border-b pb-3"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ChartBarStacked className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Quản lý loại biểu mẫu
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Danh sách loại biểu mẫu, đường dẫn và cấu hình phân loại trong hệ thống
          </p>
        </div>

        {/* Thanh tìm kiếm và nút Thêm danh mục */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc đường dẫn..."
              className="pl-8 text-xs h-9"
            />
          </div>

          <Button
            onClick={handleOpenCreateModal}
            size="sm"
            className="h-9 px-3 text-xs gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Thêm danh mục</span>
          </Button>
        </div>
      </div>

      {/* Bảng danh sách loại biểu mẫu (Tự động chiếm trọn chiều cao còn lại) */}
      <Card className="flex-1 min-h-0 flex flex-col border-border/80 shadow-xs overflow-hidden">
        <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
          <UITable>
            <TableHeader className="sticky top-0 z-10 bg-muted/30 backdrop-blur-md">
              <TableRow className="text-xs hover:bg-transparent">
                <TableHead className="h-9 px-3 w-20 font-bold text-foreground text-center">
                  ID
                </TableHead>
                <TableHead className="h-9 px-3 min-w-56 font-bold text-foreground">
                  Tên loại biểu mẫu
                </TableHead>
                <TableHead className="h-9 px-3 w-48 font-bold text-foreground">
                  Đường dẫn
                </TableHead>
                <TableHead className="h-9 px-3 w-36 font-bold text-foreground text-center">
                  Tạo ngày
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-16 text-xs text-muted-foreground"
                  >
                    {isLoading
                      ? 'Đang tải danh sách loại biểu mẫu...'
                      : 'Không tìm thấy loại biểu mẫu nào phù hợp'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-xs hover:bg-muted/40 transition-colors"
                  >
                    {/* Cột ID */}
                    <TableCell className="px-3 py-2.5 font-mono text-muted-foreground text-center">
                      #{item.id}
                    </TableCell>

                    {/* Cột Tên loại biểu mẫu (kèm icon chỉnh sửa) */}
                    <TableCell className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                          {item.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(item)}
                          className="size-6 p-0 text-muted-foreground hover:text-primary cursor-pointer shrink-0"
                          title="Đổi tên loại biểu mẫu"
                        >
                          <Pencil className="size-3" />
                        </Button>
                      </div>
                    </TableCell>

                    {/* Cột Đường dẫn */}
                    <TableCell className="px-3 py-2.5">
                      <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                        /{item.slug}
                      </span>
                    </TableCell>

                    {/* Cột Tạo ngày */}
                    <TableCell className="px-3 py-2.5 text-center text-muted-foreground">
                      {item.createdAt || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </UITable>
        </CardContent>
      </Card>

      {/* Thanh chuyển trang (Pagination) */}
      {totalItems > 0 && (
        <div
          className="
            shrink-0 flex flex-col sm:flex-row items-center
            justify-between gap-3 pt-1 text-xs text-muted-foreground"
        >
          <span>
            Hiển thị{' '}
            <strong className="font-semibold text-foreground">
              {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>
            -
            <strong className="font-semibold text-foreground">
              {Math.min(currentPage * pageSize, totalItems)}
            </strong>{' '}
            trên tổng số{' '}
            <strong className="font-semibold text-foreground">
              {totalItems}
            </strong>{' '}
            loại biểu mẫu
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
                      className="cursor-pointer text-xs h-8 w-8"
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

      {/* Hộp thoại thêm mới hoặc đổi tên danh mục (Tái sử dụng) */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
