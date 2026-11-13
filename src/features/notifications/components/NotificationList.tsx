'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Bell,
  Trash2,
  RefreshCw,
  Inbox,
  AlertCircle,
} from 'lucide-react'
import { useNotification } from '../hooks/useNotification'
import { NotificationItem } from './NotificationItem'
import { useTranslation } from 'react-i18next'

export function NotificationList() {
  const { t } = useTranslation()
  const {
    notifications,
    isLoading,
    error,
    deleteNotification,
    clearAll,
    refetch,
  } = useNotification()

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Bell className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{t('notifications.title')}</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('notifications.description')}
          </p>

        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs h-8 gap-1.5"
            title={t('notifications.refreshTitle')}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ''}`} />
            {t('notifications.refresh')}
          </Button>

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              {t('notifications.clearAll')}
            </Button>
          )}
        </div>
      </div>

      {/* Notifications Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border rounded-lg p-4 flex gap-3 items-start">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3 w-1/4 rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className="
            py-12 text-center flex flex-col items-center justify-center 
            border border-destructive/30 rounded-lg bg-destructive/5 text-destructive p-6"
        >
          <AlertCircle className="size-8 mb-2" />
          <h3 className="font-semibold text-sm">{error}</h3>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="mt-4 text-xs">
            {t('notifications.retry')}
          </Button>
        </div>
      ) : notifications.length === 0 ? (
        <div
          className="
            py-16 text-center flex flex-col items-center justify-center
            border border-dashed rounded-lg bg-card"
        >
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Inbox className="size-6" />
          </div>
          <h3 className="font-semibold text-sm">{t('notifications.emptyTitle')}</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {t('notifications.emptyDescription')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  )
}
