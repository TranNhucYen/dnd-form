'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { AppNotification } from '../types/notification.type'
import {
  getNotificationsAction,
  deleteNotificationAction,
  clearAllNotificationsAction,
} from '../actions/notification.action'

export function useNotification() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getNotificationsAction()
      if (res.success) {
        setNotifications(res.data)
      } else {
        setError(res.error)
        toast.error(res.error)
      }
    } catch (err) {
      console.error(err)
      const errorMsg = err instanceof Error ? err.message : 'Không thể tải danh sách thông báo.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

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
    isLoading,
    error,
    deleteNotification,
    clearAll,
    refetch: fetchNotifications,
  }
}
