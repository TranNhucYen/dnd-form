import { AppNotification } from '../types/notification.type'

export interface INotificationRepository {
  findAll(): Promise<AppNotification[]>
  delete(id: string): Promise<boolean>
  deleteAll(): Promise<boolean>
}
