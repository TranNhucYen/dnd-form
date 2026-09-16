'use server'

import { AppNotification } from '../types/notification.type'
import { notificationService } from '../services/notification.service'

export async function getNotificationsAction(): Promise<AppNotification[]> {
  try {
    return await notificationService.getNotifications()
  } catch (error) {
    console.error('Lỗi khi tải thông báo:', error)
    throw new Error('Không thể tải danh sách thông báo')
  }
}

export async function deleteNotificationAction(id: string): Promise<boolean> {
  try {
    return await notificationService.deleteNotification(id)
  } catch (error) {
    console.error(`Lỗi khi xóa thông báo ${id}:`, error)
    throw new Error('Không thể xóa thông báo')
  }
}

export async function clearAllNotificationsAction(): Promise<boolean> {
  try {
    return await notificationService.clearAllNotifications()
  } catch (error) {
    console.error('Lỗi khi xóa toàn bộ thông báo:', error)
    throw new Error('Không thể xóa toàn bộ thông báo')
  }
}
