'use client'

import Link from 'next/link'
import { FileText, Pencil, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DYNAMIC_ROUTES } from '@/shared/constants/routes'
import type { MyForm } from '@/features/my-form/types/my-form.type'

interface RecentFormCardProps {
  form: MyForm
}

export function RecentFormCard({ form }: RecentFormCardProps) {
  const editUrl = DYNAMIC_ROUTES.FORM_EDIT(form.id)

  return (
    <div className="flex flex-col justify-between p-4 bg-card border border-border/80 rounded-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 group">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <FileText className="size-5" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href={editUrl}
            className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1"
            title={form.name}
          >
            {form.name}
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {form.sourceTemplateName
              ? `Từ mẫu: ${form.sourceTemplateName}`
              : form.description || 'Biểu mẫu tùy chỉnh'}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5" title="Thời gian cập nhật">
          <Clock className="size-3.5 shrink-0" />
          <span>Cập nhật: {form.formattedUpdatedAt || 'Gần đây'}</span>
        </div>

        <Link href={editUrl}>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-primary hover:text-primary cursor-pointer">
            <Pencil className="size-3" />
            Sửa
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function RecentFormCardSkeleton() {
  return (
    <div className="flex flex-col justify-between p-4 bg-card border border-border/80 rounded-xl shadow-xs animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="size-10 rounded-lg bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      </div>
      <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between">
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-6 w-12 bg-muted rounded" />
      </div>
    </div>
  )
}
