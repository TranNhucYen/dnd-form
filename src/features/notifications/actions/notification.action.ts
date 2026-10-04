'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { AppNotification, ActionResponse } from '../types/notification.type'
import { notificationService } from '../services/notification.service'

async function getAuthenticatedUserId(): Promise<
  { userId: number } | { error: string; code: string }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.', code: 'UNAUTHORIZED' }
  }

  const user = await verifyJwtToken(token)
  if (!user) {
    return { error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', code: 'UNAUTHORIZED' }
  }

  if (user.status === 'blocked') {
    cookieStore.delete('auth_token')
    return { error: 'Tài khoản của bạn đã bị khóa.', code: 'ACCOUNT_BLOCKED' }
  }

  return { userId: user.id }
}

export async function getNotificationsAction(): Promise<ActionResponse<AppNotification[]>> {
  try {
    const auth = await getAuthenticatedUserId()
    if ('error' in auth) {
      return { success: false, error: auth.error, code: auth.code }
    }

    const data = await notificationService.getUserNotifications(auth.userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getNotificationsAction')
  }
}

export async function deleteNotificationAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    const auth = await getAuthenticatedUserId()
    if ('error' in auth) {
      return { success: false, error: auth.error, code: auth.code }
    }

    const result = await notificationService.deleteNotification(id, auth.userId)
    return { success: true, data: result }
  } catch (error) {
    return handleActionError(error, 'deleteNotificationAction')
  }
}

export async function clearAllNotificationsAction(): Promise<ActionResponse<boolean>> {
  try {
    const auth = await getAuthenticatedUserId()
    if ('error' in auth) {
      return { success: false, error: auth.error, code: auth.code }
    }

    const result = await notificationService.clearAllNotifications(auth.userId)
    return { success: true, data: result }
  } catch (error) {
    return handleActionError(error, 'clearAllNotificationsAction')
  }
}
