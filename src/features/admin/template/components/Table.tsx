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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
import {
  LayoutTemplate,
  Search,
  FileText,
  ListOrdered,
  MoreHorizontal,
} from 'lucide-react'
import {
  AdminTemplate,
  TemplateStatus,
  TEMPLATE_STATUS_LABELS,
} from '../types/template.type'
import { useTemplate } from '../hooks/useTemplate'
import { DescriptionModal } from './DescriptionModal'
import { GuidelineModal } from './GuidelineModal'
import { RejectModal, RejectDetailModal } from './RejectModal'
import { ApproveModal } from './ApproveModal'

export function Table() {
  const {
    paginatedTemplates,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    counts,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    updateTemplate,
  } = useTemplate()

  const [descModalTemplate, setDescModalTemplate] = useState<AdminTemplate | null>(null)
  const [guidelineModalTemplate, setGuidelineModalTemplate] = useState<AdminTemplate | null>(null)
  const [rejectModalTemplate, setRejectModalTemplate] = useState<AdminTemplate | null>(null)
  const [detailRejectTemplate, setDetailRejectTemplate] = useState<AdminTemplate | null>(null)
  const [approveModalTemplate, setApproveModalTemplate] = useState<AdminTemplate | null>(null)

  const handleStatusSelectChange = (template: AdminTemplate, newStatus: TemplateStatus) => {
    if (newStatus === TemplateStatus.REJECTED) {
      setRejectModalTemplate(template)
      return
    }

    if (newStatus === template.review_status) return

    if (newStatus === TemplateStatus.APPROVED) {
      setApproveModalTemplate(template)
      return
    } else {
      // Trường hợp chuyển về Chờ duyệt (PENDING)
      updateTemplate(template.id, {
        review_status: newStatus,
        approvedBy: undefined,
        rejectReason: undefined,
      })
    }
  }

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col gap-3">
      {/* Tiêu đề trang */}
      <div
        className="
          shrink-0 flex flex-col sm:flex-row items-start sm:items-center
          justify-between gap-3 border-b pb-3"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <LayoutTemplate className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Quản lý form mẫu
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Danh sách biểu mẫu mẫu, phân loại, trạng thái duyệt và cấu hình trả phí
          </p>
        </div>

        {/* Thanh tìm kiếm biểu mẫu */}
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc người tạo..."
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      {/* Bộ lọc biểu mẫu theo trạng thái duyệt */}
      <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Tabs
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as 'all' | TemplateStatus)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 h-9 p-1 bg-muted/60">
            <TabsTrigger
              value="all"
              className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Tất cả ({counts.all})
            </TabsTrigger>
            <TabsTrigger
              value={TemplateStatus.PENDING}
              className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Chờ duyệt ({counts[TemplateStatus.PENDING]})
            </TabsTrigger>
            <TabsTrigger
              value={TemplateStatus.APPROVED}
              className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Đã duyệt ({counts[TemplateStatus.APPROVED]})
            </TabsTrigger>
            <TabsTrigger
              value={TemplateStatus.REJECTED}
              className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Từ chối ({counts[TemplateStatus.REJECTED]})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bảng danh sách biểu mẫu (Tự động chiếm trọn phần chiều cao còn lại) */}
      <Card className="flex-1 min-h-0 flex flex-col border-border/80 shadow-xs overflow-hidden">
        <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
          <UITable>
            <TableHeader className="sticky top-0 z-10 bg-muted/30 backdrop-blur-md">
              <TableRow className="text-xs hover:bg-transparent">
                <TableHead className="h-9 px-2 w-10 font-bold text-foreground text-center">
                  ID
                </TableHead>
                <TableHead className="h-9 px-2 min-w-32 font-bold text-foreground">
                  Tên biểu mẫu
                </TableHead>
                <TableHead className="h-9 px-2 w-28 font-bold text-foreground">
                  Tạo bởi
                </TableHead>
                <TableHead className="h-9 px-2 w-24 font-bold text-foreground">
                  Chấp nhận bởi
                </TableHead>
                <TableHead className="h-9 px-2 w-24 font-bold text-foreground">
                  Loại form
                </TableHead>
                <TableHead className="h-9 px-2 w-24 font-bold text-foreground">
                  Trả phí
                </TableHead>
                <TableHead className="h-9 px-2 w-18 font-bold text-foreground text-center">
                  Mô tả
                </TableHead>
                <TableHead className="h-9 px-2 w-20 font-bold text-foreground text-center">
                  Hướng dẫn điền
                </TableHead>
                <TableHead className="h-9 px-2 w-36 font-bold text-foreground">
                  Trạng thái duyệt
                </TableHead>
                <TableHead className="h-9 px-2 w-26 font-bold text-foreground text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="h-9 px-2 w-16 font-bold text-foreground text-right">
                  Lượt tải
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTemplates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-16 text-xs text-muted-foreground"
                  >
                    {isLoading
                      ? 'Đang tải danh sách biểu mẫu...'
                      : 'Không tìm thấy biểu mẫu mẫu nào phù hợp'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTemplates.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-xs hover:bg-muted/40 transition-colors"
                  >
                    {/* Cột ID */}
                    <TableCell className="px-2 py-2.5 font-mono text-muted-foreground text-center">
                      #{item.id}
                    </TableCell>

                    {/* Cột Tên */}
                    <TableCell className="px-2 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground line-clamp-2 leading-snug">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          Tạo ngày: {item.createdAt}
                        </span>
                      </div>
                    </TableCell>

                    {/* Cột Tạo bởi */}
                    <TableCell className="px-2 py-2.5">
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground leading-tight truncate">
                          {item.creatorName}
                        </span>
                        <span className="text-[11px] text-muted-foreground leading-tight truncate">
                          {item.creatorEmail}
                        </span>
                      </div>
                    </TableCell>

                    {/* Cột Chấp nhận bởi */}
                    <TableCell className="px-2 py-2.5">
                      {item.approvedBy ? (
                        <span className="font-medium text-foreground truncate block">
                          {item.approvedBy}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Cột Loại form (Select) */}
                    <TableCell className="px-2 py-2.5">
                      <Select
                        value={String(item.categoryId)}
                        onValueChange={(val: string) => {
                          const selectedId = Number(val)
                          const selectedCat = categories.find((c) => c.id === selectedId)
                          updateTemplate(item.id, {
                            categoryId: selectedId,
                            category: selectedCat,
                          })
                        }}
                      >
                        <SelectTrigger className="w-24 h-7 text-xs bg-background px-2">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.id}
                              value={String(cat.id)}
                              className="text-xs"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Cột Trả phí (Switch + Text) */}
                    <TableCell className="px-2 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Switch
                          checked={item.isPaid}
                          onCheckedChange={(checked) =>
                            updateTemplate(item.id, { isPaid: checked })
                          }
                          aria-label="Loại phí biểu mẫu"
                          className="scale-75 origin-left"
                        />
                        <Badge
                          variant={item.isPaid ? 'default' : 'secondary'}
                          className={cn(
                            'text-[10px] w-14 justify-center h-4.5 font-medium transition-colors whitespace-nowrap',
                            item.isPaid
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.isPaid ? 'Trả phí' : 'Miễn phí'}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Cột Mô tả (Modal trigger) */}
                    <TableCell className="px-2 py-2.5 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDescModalTemplate(item)}
                        className="text-xs h-7 px-1.5 gap-1 cursor-pointer"
                      >
                        <FileText className="size-3" />
                        <span>{item.description ? 'Xem / Sửa' : 'Thêm'}</span>
                      </Button>
                    </TableCell>

                    {/* Cột Hướng dẫn điền (Modal trigger) */}
                    <TableCell className="px-2 py-2.5 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuidelineModalTemplate(item)}
                        className="text-xs h-7 px-1.5 gap-1 cursor-pointer"
                      >
                        <ListOrdered className="size-3" />
                        <span>
                          {item.guidelines && item.guidelines.length > 0
                            ? `${item.guidelines.length} bước`
                            : 'Thiết lập'}
                        </span>
                      </Button>
                    </TableCell>

                    {/* Cột Trạng thái duyệt (Select) */}
                    <TableCell className="px-2 py-2.5">
                      <div className="flex items-center gap-1">
                        <Select
                          value={item.review_status}
                          onValueChange={(val: TemplateStatus) =>
                            handleStatusSelectChange(item, val)
                          }
                        >
                          <SelectTrigger className="w-32 h-7 text-xs bg-background px-2.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value={TemplateStatus.PENDING}
                              className="text-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
                                {TEMPLATE_STATUS_LABELS[TemplateStatus.PENDING]}
                              </span>
                            </SelectItem>
                            <SelectItem
                              value={TemplateStatus.APPROVED}
                              className="text-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-600 inline-block" />
                                {TEMPLATE_STATUS_LABELS[TemplateStatus.APPROVED]}
                              </span>
                            </SelectItem>
                            <SelectItem
                              value={TemplateStatus.REJECTED}
                              className="text-xs"
                              onClick={() => {
                                if (item.review_status === TemplateStatus.REJECTED) {
                                  setRejectModalTemplate(item)
                                }
                              }}
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-rose-600 inline-block" />
                                {TEMPLATE_STATUS_LABELS[TemplateStatus.REJECTED]}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Nút xem lý do từ chối */}
                        {item.review_status === TemplateStatus.REJECTED && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailRejectTemplate(item)}
                            className="size-6 p-0 shrink-0 text-muted-foreground hover:text-rose-600 cursor-pointer"
                            title="Xem lý do từ chối"
                          >
                            <MoreHorizontal className="size-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>

                    {/* Cột Trạng thái */}
                    <TableCell className="px-2 py-2.5 text-center">
                      {item.status ? (
                        <Select
                          value={item.status}
                          onValueChange={(val: 'active' | 'block') =>
                            updateTemplate(item.id, { status: val })
                          }
                        >
                          <SelectTrigger className="w-24 h-7 text-xs bg-background mx-auto px-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active" className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-600 inline-block" />
                                active
                              </span>
                            </SelectItem>
                            <SelectItem value="block" className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-rose-600 inline-block" />
                                block
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground text-xs font-mono">-</span>
                      )}
                    </TableCell>

                    {/* Cột Lượt tải */}
                    <TableCell className="px-2 py-2.5 text-right font-medium text-foreground">
                      {item.downloads.toLocaleString('vi-VN')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </UITable>
        </CardContent>
      </Card>

      {/* Thanh chuyển trang */}
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

      {/* Các hộp thoại thao tác (Mô tả, Hướng dẫn điền, Từ chối, Phê duyệt) */}
      <DescriptionModal
        open={Boolean(descModalTemplate)}
        onOpenChange={(open) => {
          if (!open) setDescModalTemplate(null)
        }}
        template={descModalTemplate}
        onSave={(id, description) => {
          updateTemplate(id, { description })
          setDescModalTemplate(null)
        }}
      />

      <GuidelineModal
        open={Boolean(guidelineModalTemplate)}
        onOpenChange={(open) => {
          if (!open) setGuidelineModalTemplate(null)
        }}
        template={guidelineModalTemplate}
        onSave={(id, guidelines) => {
          updateTemplate(id, { guidelines })
          setGuidelineModalTemplate(null)
        }}
      />

      <RejectModal
        open={Boolean(rejectModalTemplate)}
        onOpenChange={(open) => {
          if (!open) setRejectModalTemplate(null)
        }}
        template={rejectModalTemplate}
        onConfirm={(id, rejectReason) => {
          updateTemplate(id, {
            review_status: TemplateStatus.REJECTED,
            rejectReason,
            approvedBy: undefined,
          })
          setRejectModalTemplate(null)
        }}
      />

      <RejectDetailModal
        open={Boolean(detailRejectTemplate)}
        onOpenChange={(open) => {
          if (!open) setDetailRejectTemplate(null)
        }}
        template={detailRejectTemplate}
      />

      <ApproveModal
        open={Boolean(approveModalTemplate)}
        onOpenChange={(open) => {
          if (!open) setApproveModalTemplate(null)
        }}
        template={approveModalTemplate}
        onConfirm={(id) => {
          updateTemplate(id, {
            review_status: TemplateStatus.APPROVED,
            approvedBy: 'Trần Nhực Yên',
            rejectReason: undefined,
          })
          setApproveModalTemplate(null)
        }}
      />
    </div>
  )
}
