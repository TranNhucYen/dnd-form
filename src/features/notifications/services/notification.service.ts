import { AppNotification } from '../types/notification.type'
import { notificationRepository } from '../repositories'

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    return await notificationRepository.findAll()
  },

  async deleteNotification(id: string): Promise<boolean> {
    return await notificationRepository.delete(id)
  },

  async clearAllNotifications(): Promise<boolean> {
    return await notificationRepository.deleteAll()
  },
}
