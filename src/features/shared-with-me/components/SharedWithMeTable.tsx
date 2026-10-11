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
import { FileText, Calendar, Edit3, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SharedWithMeItem } from '../types/shared-with-me.type'
import { getInitials } from '@/shared/utils'

interface SharedWithMeTableProps {
  forms: SharedWithMeItem[]
}

export function SharedWithMeTable({ forms }: SharedWithMeTableProps) {
  const router = useRouter()

  return (
    <div className="flex-1 min-h-[260px] rounded-xl border border-border bg-card overflow-hidden shadow-xs flex flex-col">
      <ScrollArea type="always" className="h-full w-full">
        <Table className="min-w-[650px]">
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-xs shadow-xs">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-bold text-foreground py-3.5 pl-4">
                Tên biểu mẫu
              </TableHead>
              <TableHead className="w-[280px] text-xs font-bold text-foreground">
                Được chia sẻ bởi
              </TableHead>
              <TableHead className="w-[180px] text-xs font-bold text-foreground pr-4">
                Ngày chia sẻ
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {forms.map((item) => (
              <TableRow
                key={item.id}
                onDoubleClick={() => router.push(`/editor?formId=${item.id}`)}
                className="hover:bg-muted/80 transition-colors group cursor-pointer select-none"
                title="Nhấp đúp chuột để mở biểu mẫu"
              >
                {/* Cột 1: Tên biểu mẫu */}
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
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/editor?formId=${item.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-semibold text-foreground group-hover:text-primary
                          transition-colors truncate block"
                          title={item.name}
                        >
                          {item.name}
                        </Link>

                        {item.permission === 'edit' ? (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700
                            dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80
                            dark:border-amber-800/80 px-1.5 py-0.5 rounded shrink-0"
                            title="Bạn có quyền chỉnh sửa biểu mẫu này"
                          >
                            <Edit3 className="size-2.5" />
                            Chỉnh sửa
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700
                            dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80
                            dark:border-blue-800/80 px-1.5 py-0.5 rounded shrink-0"
                            title="Bạn có quyền xem biểu mẫu này"
                          >
                            <Eye className="size-2.5" />
                            Chỉ xem
                          </span>
                        )}
                      </div>

                      {item.description ? (
                        <p
                          className="text-xs text-muted-foreground line-clamp-1"
                          title={item.description}
                        >
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>

                {/* Cột 2: Được chia sẻ bởi */}
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="size-8 rounded-full bg-primary/10 text-primary
                      flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20"
                    >
                      {getInitials(item.ownerName) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-xs font-semibold text-foreground truncate"
                        title={item.ownerName}
                      >
                        {item.ownerName}
                      </span>
                      <span
                        className="text-[11px] text-muted-foreground truncate"
                        title={item.ownerEmail}
                      >
                        {item.ownerEmail}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Cột 3: Ngày chia sẻ */}
                <TableCell className="py-3.5 pr-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
                    <span>{item.formattedSharedAt || '—'}</span>
                  </div>
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
