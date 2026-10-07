import { isMockMode } from '@/lib/config'
import { INotificationRepository, drizzleNotificationRepository } from './notification.repository'
import { notificationMockRepository } from './notification.mock.repository'

export const notificationRepository: INotificationRepository = isMockMode()
  ? notificationMockRepository
  : drizzleNotificationRepository

export * from './notification.repository'
