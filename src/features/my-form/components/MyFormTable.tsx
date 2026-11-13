'use client'

import { useTranslation } from 'react-i18next'
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
  Inbox,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import type { MyForm } from '../types/my-form.type'
import { useExportFormPdf } from '../hooks/useExportFormPdf'

interface MyFormTableProps {
  forms: MyForm[]
  selectedIds: Set<number>
  onToggleForm: (id: number, checked: boolean) => void
  onToggleVisibleForms: (checked: boolean) => void
  onOpenPreview: (form: MyForm) => void
  onOpenShare: (form: MyForm) => void
  onOpenCollect: (form: MyForm) => void
  onOpenDelete: (form: MyForm) => void
  onOpenDuplicate: (form: MyForm) => void
}

export function MyFormTable({
  forms,
  selectedIds,
  onToggleForm,
  onToggleVisibleForms,
  onOpenPreview,
  onOpenShare,
  onOpenCollect,
  onOpenDelete,
  onOpenDuplicate,
}: MyFormTableProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { isExporting, downloadPdf } = useExportFormPdf()
  const allVisibleSelected = forms.length > 0 && forms.every((form) => selectedIds.has(form.id))

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
          title={t('myForm.publicAndShared', { count: form.sharedWith.length })}
        >
          <Globe className="size-3.5 shrink-0" />
          <span className="truncate max-w-[120px]">{t('myForm.generated.congKhai2')}{form.sharedWith.length})</span>
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
          title={t('myForm.generated.batKyAiCoLienKet')}
        >
          <Globe className="size-3.5 shrink-0" />
          <span className="truncate max-w-[110px]">{t('myForm.generated.congKhai')}</span>
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
          title={t('myForm.sharedWith', { count: form.sharedWith.length })}
        >
          <Users className="size-3.5 shrink-0" />
          <span>{form.sharedWith.length} {t('myForm.generated.nguoi')}</span>
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
        title={t('myForm.generated.chiMinhBan')}
      >
        <Lock className="size-3.5 shrink-0" />
        <span>{t('myForm.generated.riengTu')}</span>
      </button>
    )
  }

  return (
    <div className="flex-1 min-h-[260px] rounded-lg border border-border bg-card overflow-hidden shadow-xs flex flex-col">
      <ScrollArea type="always" className="h-full w-full">
        <Table className="min-w-[650px]">
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-xs shadow-xs">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  aria-label={t('myForm.generated.chonTatCaBieuMauDangHienThi')}
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) => onToggleVisibleForms(checked === true)}
                />
              </TableHead>
              <TableHead className="text-xs font-bold text-foreground py-3.5 pl-4">
                {t('myForm.generated.tenBieuMau')}
              </TableHead>
              <TableHead className="w-[125px] text-xs font-bold text-foreground">
                {t('myForm.generated.ngayTao')}
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-foreground">
                {t('myForm.generated.ngayCapNhat')}
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-foreground">
                {t('myForm.generated.quyenTruyCap')}
              </TableHead>
              <TableHead className="w-[60px] text-right text-xs font-bold text-foreground pr-4">
                {t('myForm.generated.thaoTac')}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {forms.map((form) => (
              <TableRow
                key={form.id}
                onDoubleClick={() => router.push(`/editor?formId=${form.id}`)}
                className={`hover:bg-muted/80 transition-colors group cursor-pointer select-none ${selectedIds.has(form.id) ? 'bg-muted/50' : ''}`}
                title={t('myForm.generated.nhapDupChuotDeChinhSuaBieuMau')}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    aria-label={t('myForm.selectForm', { name: form.name })}
                    checked={selectedIds.has(form.id)}
                    onCheckedChange={(checked) => onToggleForm(form.id, checked === true)}
                  />
                </TableCell>
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
                            {t('myForm.generated.tuMau')} {form.sourceTemplateName}
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
                        <span className="sr-only">{t('myForm.generated.menu')}</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52 text-xs">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          {t('myForm.generated.thaoTac')}
                        </DropdownMenuLabel>

                        {/* Edit */}
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/editor?formId=${form.id}`}>
                            <Pencil />
                            <span>{t('myForm.generated.chinhSuaForm')}</span>
                          </Link>
                        </DropdownMenuItem>

                        {/* Collect via E-Form */}
                        <DropdownMenuItem
                          onClick={() => onOpenCollect(form)}
                          className="cursor-pointer"
                        >
                          <Inbox className="text-emerald-600" />
                          <span>{t('myForm.generated.thuThapQuaEForm')}</span>
                        </DropdownMenuItem>

                        {/* Preview */}
                        <DropdownMenuItem
                          onClick={() => onOpenPreview(form)}
                          className="cursor-pointer"
                        >
                          <Eye />
                          <span>{t('myForm.generated.xemTruoc')}</span>
                        </DropdownMenuItem>

                        {/* Share */}
                        <DropdownMenuItem
                          onClick={() => onOpenShare(form)}
                          className="cursor-pointer"
                        >
                          <Share2 />
                          <span>{t('myForm.generated.chiaSePhanQuyen')}</span>
                        </DropdownMenuItem>

                        {/* Duplicate & Redirect to Editor */}
                        <DropdownMenuItem
                          onClick={() => onOpenDuplicate(form)}
                          className="cursor-pointer"
                        >
                          <Copy />
                          <span>{t('myForm.generated.nhanBanBieuMau')}</span>
                        </DropdownMenuItem>

                        {/* Tải xuống PDF */}
                        <DropdownMenuItem
                          onClick={() => downloadPdf(form.id, form.name)}
                          disabled={isExporting}
                          className="cursor-pointer"
                        >
                          <Download />
                          <span>{t('myForm.generated.taiXuongPdf')}</span>
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
                          <span>{t('myForm.generated.xoaBieuMau')}</span>
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
