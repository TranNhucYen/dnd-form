export enum NotificationType {
  FORM_SHARED = 'form_shared',
  ROLE_UPDATED = 'role_updated',
  COMMUNITY_REVIEW = 'community_review',
  SYSTEM_UPDATE = 'system_update',
}

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date | string
}
