'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Share2,
  Sparkles,
  Globe,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { AppNotification, NotificationType } from '../types/notification.type'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

interface NotificationItemProps {
  notification: AppNotification
  onDelete: (id: string) => void
}

function getRelativeTime(dateStr: Date | string, t: TFunction): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffSec < 60) return t('notifications.justNow')
  if (diffSec < 3600) return t('notifications.minutesAgo', { count: Math.floor(diffSec / 60) })
  if (diffSec < 86400) return t('notifications.hoursAgo', { count: Math.floor(diffSec / 3600) })
  return t('notifications.daysAgo', { count: Math.floor(diffSec / 86400) })
}

export function NotificationItem({
  notification,
  onDelete,
}: NotificationItemProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const renderIcon = () => {
    switch (notification.type) {
      case NotificationType.FORM_SHARED:
        return (
          <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Share2 className="size-4" />
          </div>
        )
      case NotificationType.COMMUNITY_REVIEW:
        return (
          <div className="size-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Globe className="size-4" />
          </div>
        )
      case NotificationType.SYSTEM_UPDATE:
        return (
          <div className="size-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="size-4" />
          </div>
        )
    }
  }

  const handleClick = () => {
    if (
      notification.actionUrl &&
      notification.actionUrl.startsWith('/') &&
      !notification.actionUrl.startsWith('//') &&
      !notification.actionUrl.startsWith('/\\')
    ) {
      router.push(notification.actionUrl)
    }
  }


  const rejectReason = notification.metadata?.rejectReason ? String(notification.metadata.rejectReason) : null

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 rounded-lg border border-border/60 bg-card transition-all flex items-start gap-3.5',
        notification.actionUrl ? 'cursor-pointer hover:border-primary/50 hover:bg-muted/20' : 'hover:border-border'
      )}
    >

      {renderIcon()}

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-xs font-semibold leading-tight text-foreground truncate">
              {notification.title}
            </h4>
            {notification.actionUrl && (
              <ExternalLink className="size-3 text-muted-foreground shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">
              {getRelativeTime(notification.createdAt, t)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(notification.id)
              }}
              className="size-7 p-0 text-muted-foreground hover:text-destructive"
              title={t('notifications.deleteTitle')}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {notification.message}
        </p>

        {rejectReason && (
          <div className="mt-1.5 p-2 rounded-md bg-destructive/10 text-destructive text-xs border border-destructive/20 leading-relaxed">
            <span className="font-semibold">{t('notifications.rejectReason')}</span> {rejectReason}
          </div>
        )}
      </div>
    </div>
  )
}
