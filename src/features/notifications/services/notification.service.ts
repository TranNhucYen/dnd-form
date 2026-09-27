import { AppNotification, CreateNotificationPayload, NotificationType } from '../types/notification.type'
import { notificationRepository } from '../repositories'
import { NOTIFICATION_TEMPLATES } from '../constants/notification.constant'

export const notificationService = {
  async getUserNotifications(userId: number): Promise<AppNotification[]> {
    try {
      return await notificationRepository.findByUserId(userId)
    } catch (error) {
      console.error(`Lỗi khi lấy thông báo cho user ${userId}:`, error)
      throw new Error('Không thể tải danh sách thông báo.')
    }
  },

  async deleteNotification(id: string, userId: number): Promise<boolean> {
    try {
      return await notificationRepository.delete(id, userId)
    } catch (error) {
      console.error(`Lỗi khi xóa thông báo ${id}:`, error)
      throw new Error('Không thể xóa thông báo.')
    }
  },

  async clearAllNotifications(userId: number): Promise<boolean> {
    try {
      return await notificationRepository.deleteAllByUserId(userId)
    } catch (error) {
      console.error(`Lỗi khi xóa tất cả thông báo cho user ${userId}:`, error)
      throw new Error('Không thể xóa tất cả thông báo.')
    }
  },

  async createNotification(payload: CreateNotificationPayload): Promise<AppNotification> {
    try {
      return await notificationRepository.create(payload)
    } catch (error) {
      console.error('Lỗi khi tạo thông báo mới:', error)
      throw new Error('Không thể tạo thông báo mới.')
    }
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
