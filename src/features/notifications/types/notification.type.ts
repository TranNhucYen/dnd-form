export enum NotificationType {
  FORM_SHARED = 'form_shared',
  COMMUNITY_REVIEW = 'community_review',
  SYSTEM_UPDATE = 'system_update',
}

export interface AppNotification {
  id: string
  userId: number
  actorId?: number | null
  actorName?: string | null
  type: NotificationType
  title: string
  message: string
  actionUrl?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: Date | string
}

export interface CreateNotificationPayload {
  userId: number
  actorId?: number | null
  type: NotificationType
  title: string
  message: string
  actionUrl?: string | null
  metadata?: Record<string, unknown> | null
}

export type { ActionResponse } from '@/shared/types/action.type'
