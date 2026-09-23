'use client'

import { useState, useEffect, useCallback } from 'react'
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
      setNotifications(res)
    } catch (err) {
      console.error(err)
      setError('Không thể tải thông báo.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await deleteNotificationAction(id)
  }

  const clearAll = async () => {
    setNotifications([])
    await clearAllNotificationsAction()
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
