import { AppNotification, CreateNotificationPayload, NotificationType } from '../types/notification.type'
import { notificationRepository } from '../repositories'
import { NOTIFICATION_TEMPLATES } from '../constants/notification.constant'
import { ValidationError } from '@/shared/errors'

export const notificationService = {
  async getUserNotifications(userId: number): Promise<AppNotification[]> {
    return await notificationRepository.findByUserId(userId)
  },

  async deleteNotification(id: string, userId: number): Promise<boolean> {
    if (!id || !id.trim()) {
      throw new ValidationError('Mã thông báo không hợp lệ.')
    }
    return await notificationRepository.delete(id, userId)
  },

  async clearAllNotifications(userId: number): Promise<boolean> {
    return await notificationRepository.deleteAllByUserId(userId)
  },

  async createNotification(payload: CreateNotificationPayload): Promise<AppNotification> {
    return await notificationRepository.create(payload)
  },

  /** Tạo thông báo an toàn, tự bắt lỗi nội bộ không ném ngoại lệ */
  async safeCreateNotification(payload: CreateNotificationPayload): Promise<AppNotification | null> {
    try {
      return await notificationRepository.create(payload)
    } catch (error) {
      console.error('[NotificationService] Lỗi khi tạo thông báo (safeCreateNotification):', error)
      return null
    }
  },

  /** Thông báo kết quả duyệt template cho tác giả (tự kiểm tra, format và bắt lỗi an toàn) */
  async notifyTemplateReview(
    existing: { review_status?: string },
    updated: { id: number; title: string },
    data: { review_status?: string; rejectReason?: string },
    adminUserId?: number
  ): Promise<void> {
    try {
      if (!data.review_status || data.review_status === existing.review_status) return

      const isApproved = data.review_status === 'approved'
      const isRejected = data.review_status === 'rejected'
      if (!isApproved && !isRejected) return

      const authorId = await notificationRepository.findTemplateAuthorId(updated.id)
      if (!authorId) return

      const templateConfig = isApproved ? NOTIFICATION_TEMPLATES.COMMUNITY_REVIEW.APPROVED : NOTIFICATION_TEMPLATES.COMMUNITY_REVIEW.REJECTED
      const title = templateConfig.TITLE
      const message = isApproved ? templateConfig.MESSAGE(updated.title) : templateConfig.MESSAGE(updated.title, data.rejectReason)

      await notificationRepository.create({
        userId: authorId,
        actorId: adminUserId || null,
        type: NotificationType.COMMUNITY_REVIEW,
        title,
        message,
        actionUrl: templateConfig.ACTION_URL,
        metadata: {
          templateId: updated.id,
          status: data.review_status,
          rejectReason: data.rejectReason || null,
        },
      })
    } catch (error) {
      console.error('[NotificationService] Lỗi gửi thông báo xét duyệt biểu mẫu:', error)
    }
  },
}
