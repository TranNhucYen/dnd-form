'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Share2,
  Copy,
  Trash2,
  FileText,
  Globe,
  Lock,
  Users,
  Sparkles,
  Calendar,
  Download,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MyForm } from '../types/my-form.type'
import { useExportFormPdf } from '../hooks/useExportFormPdf'

interface MyFormTableProps {
  forms: MyForm[]
  onOpenPreview: (form: MyForm) => void
  onOpenShare: (form: MyForm) => void
  onOpenDelete: (form: MyForm) => void
  onOpenDuplicate: (form: MyForm) => void
}

export function MyFormTable({
  forms,
  onOpenPreview,
  onOpenShare,
  onOpenDelete,
  onOpenDuplicate,
}: MyFormTableProps) {
  const router = useRouter()
  const { isExporting, downloadPdf } = useExportFormPdf()

  const renderAccessBadge = (form: MyForm) => {
    if (form.isPublic && form.sharedWith && form.sharedWith.length > 0) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpenShare(form)
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800
            bg-emerald-50/70 hover:bg-emerald-100/70 px-2 py-0.5 rounded-md
            transition-colors cursor-pointer border border-emerald-200/60"
          title={`Công khai và đã chia sẻ với ${form.sharedWith.length} người`}
        >
          <Globe className="size-3.5 shrink-0" />
          <span className="truncate max-w-[120px]">Công khai ({form.sharedWith.length})</span>
        </button>
      )
    }

    if (form.isPublic) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpenShare(form)
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800
            bg-emerald-50/70 hover:bg-emerald-100/70 px-2 py-0.5 rounded-md
            transition-colors cursor-pointer border border-emerald-200/60"
          title="Bất kỳ ai có liên kết"
        >
          <Globe className="size-3.5 shrink-0" />
          <span className="truncate max-w-[110px]">Công khai</span>
        </button>
      )
    }

    if (form.sharedWith && form.sharedWith.length > 0) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpenShare(form)
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-800
            bg-indigo-50/70 hover:bg-indigo-100/70 px-2 py-0.5 rounded-md
            transition-colors cursor-pointer border border-indigo-200/60"
          title={`Chia sẻ với ${form.sharedWith.length} người`}
        >
          <Users className="size-3.5 shrink-0" />
          <span>{form.sharedWith.length} người</span>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpenShare(form)
        }}
        onDoubleClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
          bg-muted hover:bg-muted/80 px-2 py-0.5 rounded-md
          transition-colors cursor-pointer border border-border"
        title="Chỉ mình bạn"
      >
        <Lock className="size-3.5 shrink-0" />
        <span>Riêng tư</span>
      </button>
    )
  }

  return (
    <div className="flex-1 min-h-[260px] rounded-xl border border-border bg-card overflow-hidden shadow-xs flex flex-col">
      <ScrollArea type="always" className="h-full w-full">
        <Table className="min-w-[650px]">
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-xs shadow-xs">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-bold text-foreground py-3.5 pl-4">
                Tên biểu mẫu
              </TableHead>
              <TableHead className="w-[125px] text-xs font-bold text-foreground">
                Ngày tạo
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-foreground">
                Ngày cập nhật
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-foreground">
                Quyền truy cập
              </TableHead>
              <TableHead className="w-[60px] text-right text-xs font-bold text-foreground pr-4">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {forms.map((form) => (
              <TableRow
                key={form.id}
                onDoubleClick={() => router.push(`/editor?formId=${form.id}`)}
                className="hover:bg-muted/80 transition-colors group cursor-pointer select-none"
                title="Nhấp đúp chuột để chỉnh sửa biểu mẫu"
              >
                {/* Form Name & Info */}
                <TableCell className="py-3.5 pl-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="size-9 rounded-lg bg-muted text-muted-foreground
                    flex items-center justify-center shrink-0 mt-0.5
                    group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                    >
                      <FileText className="size-4.5" />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span
                        className="text-sm font-semibold text-foreground group-hover:text-primary
                        transition-colors truncate block"
                        title={form.name}
                      >
                        {form.name}
                      </span>

                      {form.description ? (
                        <p
                          className="text-xs text-muted-foreground line-clamp-1"
                          title={form.description}
                        >
                          {form.description}
                        </p>
                      ) : null}

                      {form.sourceTemplateName && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Sparkles className="size-3 text-amber-500 shrink-0" />
                          <span className="truncate">
                            Từ mẫu: {form.sourceTemplateName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Created Date */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
                    <span>{form.formattedCreatedAt}</span>
                  </div>
                </TableCell>

                {/* Updated Date */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-foreground whitespace-nowrap">
                    <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
                    <span className="font-medium">{form.formattedUpdatedAt}</span>
                  </div>
                </TableCell>

                {/* Access */}
                <TableCell>
                  <div className="flex items-center">{renderAccessBadge(form)}</div>
                </TableCell>

                {/* Action Dropdown Menu */}
                <TableCell
                  className="text-right pr-4"
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 text-xs">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Thao tác
                        </DropdownMenuLabel>

                        {/* Edit */}
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/editor?formId=${form.id}`}>
                            <Pencil />
                            <span>Chỉnh sửa form</span>
                          </Link>
                        </DropdownMenuItem>

                        {/* Preview */}
                        <DropdownMenuItem
                          onClick={() => onOpenPreview(form)}
                          className="cursor-pointer"
                        >
                          <Eye />
                          <span>Xem trước</span>
                        </DropdownMenuItem>

                        {/* Share */}
                        <DropdownMenuItem
                          onClick={() => onOpenShare(form)}
                          className="cursor-pointer"
                        >
                          <Share2 />
                          <span>Chia sẻ & Phân quyền</span>
                        </DropdownMenuItem>

                        {/* Duplicate & Redirect to Editor */}
                        <DropdownMenuItem
                          onClick={() => onOpenDuplicate(form)}
                          className="cursor-pointer"
                        >
                          <Copy />
                          <span>Nhân bản biểu mẫu</span>
                        </DropdownMenuItem>

                        {/* Tải xuống PDF */}
                        <DropdownMenuItem
                          onClick={() => downloadPdf(form.id, form.name)}
                          disabled={isExporting}
                          className="cursor-pointer"
                        >
                          <Download />
                          <span>Tải xuống (PDF)</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        {/* Delete */}
                        <DropdownMenuItem
                          onClick={() => onOpenDelete(form)}
                          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 />
                          <span>Xóa biểu mẫu</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
