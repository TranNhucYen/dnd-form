'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { AppNotification, ActionResponse } from '../types/notification.type'
import { notificationService } from '../services/notification.service'

async function getAuthenticatedUserId(): Promise<number | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null

  const user = await verifyJwtToken(token)
  return user ? user.id : null
}

export async function getNotificationsAction(): Promise<ActionResponse<AppNotification[]>> {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return { success: false, error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }
    }

    const data = await notificationService.getUserNotifications(userId)
    return { success: true, data }
  } catch (error) {
    console.error('Lỗi khi tải thông báo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải danh sách thông báo.',
    }
  }
}

export async function deleteNotificationAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return { success: false, error: 'Phiên đăng nhập đã hết hạn.' }
    }

    const result = await notificationService.deleteNotification(id, userId)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Lỗi khi xóa thông báo ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa thông báo.',
    }
  }
}

export async function clearAllNotificationsAction(): Promise<ActionResponse<boolean>> {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return { success: false, error: 'Phiên đăng nhập đã hết hạn.' }
    }

    const result = await notificationService.clearAllNotifications(userId)
    return { success: true, data: result }
  } catch (error) {
    console.error('Lỗi khi xóa tất cả thông báo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa tất cả thông báo.',
    }
  }
}
