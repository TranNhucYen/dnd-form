export interface NotificationSettings {
  emailNotifications: boolean
  formShared: boolean
  communityReview: boolean
  systemUpdates: boolean
}

export interface LocalizationSettings {
  language: 'vi' | 'en'
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'
  timezone: string
}

export interface AppSettings {
  localization: LocalizationSettings
  notifications: NotificationSettings
}
