'use client'

import { useState } from 'react'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChartBarStacked, Search, Plus, Pencil } from 'lucide-react'
import { Category } from '../types/category.type'
import { useCategory } from '../hooks/useCategory'
import { Modal } from './Modal'
import { AdminPageHeader, AdminPagination, AdminTableHeader } from '@/features/admin/shared'

export function Table() {
  const {
    paginatedCategories,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
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
      {/* Header trang dùng chung */}
      <AdminPageHeader
        title="Quản lý loại biểu mẫu"
        description="Danh sách loại biểu mẫu, đường dẫn và cấu hình phân loại trong hệ thống"
        icon={<ChartBarStacked className="size-4" />}
      >
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
      </AdminPageHeader>

      {/* Bảng danh sách loại biểu mẫu */}
      <Card className="flex-1 min-h-0 flex flex-col border-border/80 shadow-xs overflow-hidden">
        <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
          <UITable>
            <AdminTableHeader
              columns={[
                { title: 'ID', width: 'w-20', align: 'center' },
                { title: 'Tên loại biểu mẫu', width: 'min-w-56' },
                { title: 'Đường dẫn', width: 'w-48' },
                { title: 'Tạo ngày', width: 'w-36', align: 'center' },
              ]}
            />
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

                    {/* Cột Tên loại biểu mẫu (kèm nút sửa) */}
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

        {/* Phân trang dùng chung */}
        <AdminPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="loại biểu mẫu"
        />
      </Card>

      {/* Hộp thoại thêm mới hoặc đổi tên danh mục */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
