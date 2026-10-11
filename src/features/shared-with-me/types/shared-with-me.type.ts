import type { ActionResponse } from '@/shared/types/action.type'

export type SharedPermission = 'view' | 'edit'

export interface SharedWithMeItem {
  id: number
  name: string
  description?: string | null
  permission: SharedPermission
  sharedAt: string
  formattedSharedAt?: string
  ownerId: number
  ownerName: string
  ownerEmail: string
}

export type { ActionResponse }
