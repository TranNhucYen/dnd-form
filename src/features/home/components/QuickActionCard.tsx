'use client'

import Link from 'next/link'
import { LucideIcon, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColorClassName?: string
  iconBgClassName?: string
  href?: string
  onClick?: () => void
  actionLabel?: string
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  iconColorClassName = 'text-primary',
  iconBgClassName = 'bg-primary/10',
  href,
  onClick,
  actionLabel = 'Bắt đầu',
}: QuickActionCardProps) {
  const innerCard = (
    <div
      onClick={onClick}
      className={cn(
        'group flex flex-col justify-between p-5 bg-card border border-border/80 rounded-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer text-left h-full select-none'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={cn(
            'size-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
            iconBgClassName,
            iconColorClassName
          )}
        >
          <Icon className="size-5" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors">
          {actionLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>

      <div>
        <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {innerCard}
      </Link>
    )
  }

  return innerCard
}
