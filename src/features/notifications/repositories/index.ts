import { INotificationRepository } from './notification.repository'
import { notificationMockRepository } from './notification.mock.repository'

export const notificationRepository: INotificationRepository = notificationMockRepository
export * from './notification.repository'
export * from './notification.mock.repository'
