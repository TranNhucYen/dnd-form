'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AppNotification } from '../types/notification.type'
import {
  getNotificationsAction,
  deleteNotificationAction,
  clearAllNotificationsAction,
} from '../actions/notification.action'

export const NOTIFICATIONS_KEY = ['notifications', 'list'] as const

async function fetchNotifications(): Promise<AppNotification[]> {
  const res = await getNotificationsAction()
  if (!res.success) {
    throw new Error(res.error)
  }
  return res.data
}

export function useNotification() {
  const queryClient = useQueryClient()

  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotifications,
    // Thông báo cần luôn mới khi mở trang; dữ liệu cũ chỉ dùng để tránh nháy skeleton.
    staleTime: 0,
  })

  useEffect(() => {
    if (notificationsQuery.error) {
      toast.error(notificationsQuery.error.message)
    }
  }, [notificationsQuery.error])

  const notifications = notificationsQuery.data ?? []

  const setNotifications = (
    value:
      | AppNotification[]
      | ((prev: AppNotification[]) => AppNotification[])
  ) => {
    queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (prev) => {
      const current = prev ?? []
      return typeof value === 'function' ? value(current) : value
    })
  }

  const deleteNotification = async (id: string) => {
    const prevNotifications = notifications
    setNotifications((prev) => prev.filter((n) => n.id !== id))

    try {
      const res = await deleteNotificationAction(id)
      if (!res.success) {
        setNotifications(prevNotifications)
        toast.error(res.error)
      } else {
        toast.success('Đã xóa thông báo.')
      }
    } catch {
      setNotifications(prevNotifications)
      toast.error('Lỗi khi xóa thông báo.')
    }
  }

  const clearAll = async () => {
    if (notifications.length === 0) return

    const prevNotifications = notifications
    setNotifications([])

    try {
      const res = await clearAllNotificationsAction()
      if (!res.success) {
        setNotifications(prevNotifications)
        toast.error(res.error)
      } else {
        toast.success('Đã xóa toàn bộ thông báo.')
      }
    } catch {
      setNotifications(prevNotifications)
      toast.error('Lỗi khi xóa toàn bộ thông báo.')
    }
  }

  return {
    notifications,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error?.message ?? null,
    deleteNotification,
    clearAll,
    refetch: notificationsQuery.refetch,
  }
}
