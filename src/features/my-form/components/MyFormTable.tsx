'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { MyForm, FormStatus } from '../types/my-form.type'
import { FORM_STATUS_LABELS } from '../constants/my-form.constant'

interface MyFormTableProps {
  forms: MyForm[]
  onOpenPreview: (form: MyForm) => void
  onOpenShare: (form: MyForm) => void
  onOpenDelete: (form: MyForm) => void
  onOpenDuplicate: (form: MyForm) => void
  onUpdateStatus: (id: number, status: FormStatus) => Promise<unknown>
}

export function MyFormTable({
  forms,
  onOpenPreview,
  onOpenShare,
  onOpenDelete,
  onOpenDuplicate,
  onUpdateStatus,
}: MyFormTableProps) {

  const renderStatus = (form: MyForm) => {
    switch (form.status) {
      case FormStatus.ACTIVE:
        return (
          <span className="text-xs font-medium text-emerald-600">
            {FORM_STATUS_LABELS[FormStatus.ACTIVE]}
          </span>
        )
      case FormStatus.DRAFT:
        return (
          <span className="text-xs font-medium text-amber-600">
            {FORM_STATUS_LABELS[FormStatus.DRAFT]}
          </span>
        )
      case FormStatus.ARCHIVED:
        return (
          <span className="text-xs font-medium text-muted-foreground">
            {FORM_STATUS_LABELS[FormStatus.ARCHIVED]}
          </span>
        )
    }
  }

  const renderAccessBadge = (form: MyForm) => {
    if (form.isPublic) {
      return (
        <button
          type="button"
          onClick={() => onOpenShare(form)}
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
          onClick={() => onOpenShare(form)}
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
        onClick={() => onOpenShare(form)}
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
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-bold text-foreground py-3.5 pl-4">
              Tên biểu mẫu
            </TableHead>
            <TableHead className="w-[140px] text-xs font-bold text-foreground">
              Trạng thái
            </TableHead>
            <TableHead className="w-[140px] text-xs font-bold text-foreground">
              Quyền truy cập
            </TableHead>
            <TableHead className="w-[120px] text-xs font-bold text-foreground">
              Cập nhật
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
              className="hover:bg-muted/40 transition-colors group"
            >
              {/* Form Title & Info */}
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
                    <Link
                      href={`/editor?formId=${form.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary
                        transition-colors truncate block"
                      title={form.title}
                    >
                      {form.title}
                    </Link>

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

              {/* Status */}
              <TableCell>
                <div className="flex items-center">{renderStatus(form)}</div>
              </TableCell>

              {/* Access */}
              <TableCell>
                <div className="flex items-center">{renderAccessBadge(form)}</div>
              </TableCell>

              {/* Date */}
              <TableCell>
                <div className="flex flex-col text-xs whitespace-nowrap">
                  <span className="font-medium text-foreground">
                    {form.formattedUpdatedAt}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Tạo: {form.formattedCreatedAt}
                  </span>
                </div>
              </TableCell>

              {/* Action Dropdown Menu */}
              <TableCell className="text-right pr-4">
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

                      {/* Change Status Submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-xs">
                          <CheckCircle2 />
                          <span>Đổi trạng thái</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-40 text-xs">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(form.id, FormStatus.ACTIVE)}
                              className="cursor-pointer"
                            >
                              <span className="size-2 rounded-full bg-emerald-500" />
                              <span>Đang sử dụng</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(form.id, FormStatus.DRAFT)}
                              className="cursor-pointer"
                            >
                              <span className="size-2 rounded-full bg-amber-500" />
                              <span>Bản nháp</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(form.id, FormStatus.ARCHIVED)}
                              className="cursor-pointer"
                            >
                              <span className="size-2 rounded-full bg-muted-foreground" />
                              <span>Đã lưu trữ</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
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
    </div>
  )
}


