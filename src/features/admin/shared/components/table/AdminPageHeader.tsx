'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AdminPageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  children?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  icon,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3',
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  )
}
