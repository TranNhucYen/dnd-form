'use client'

import { ReactNode } from 'react'
import { TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface TableColumnHeader {
  title: ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

interface AdminTableHeaderProps {
  columns: (string | TableColumnHeader)[]
  className?: string
}

export function AdminTableHeader({ columns, className }: AdminTableHeaderProps) {
  return (
    <TableHeader className={cn('sticky top-0 z-10 bg-muted/50 backdrop-blur-md', className)}>
      <TableRow className="text-xs hover:bg-transparent">
        {columns.map((col, index) => {
          const isString = typeof col === 'string'
          const title = isString ? col : col.title
          const width = isString ? undefined : col.width
          const align = isString ? undefined : col.align
          const customClass = isString ? undefined : col.className

          return (
            <TableHead
              key={index}
              className={cn(
                'h-9 px-3 font-bold text-foreground whitespace-nowrap',
                align === 'center' && 'text-center',
                align === 'right' && 'text-right',
                width,
                customClass
              )}
            >
              {title}
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}
