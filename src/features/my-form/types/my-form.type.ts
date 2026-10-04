export { ShareRole, type SharedUser } from '@/shared/types/share.type'
export type { ActionResponse } from '@/shared/types/action.type'

import { ShareRole, SharedUser } from '@/shared/types/share.type'

export interface MyForm {
  id: number
  name: string
  description?: string | null
  fieldsCount: number
  isPublic: boolean
  sharedWith?: SharedUser[]
  sourceTemplateId?: number | null
  sourceTemplateName?: string | null
  createdAt: string
  updatedAt: string
  formattedCreatedAt?: string
  formattedUpdatedAt?: string
  shareSummary?: string
}

export interface CreateBlankFormInput {
  name: string
  description?: string
  sourceTemplateId?: number
}

export interface UpdateFormInput {
  name?: string
  description?: string
  isPublic?: boolean
  sharedWith?: SharedUser[]
}

export interface SaveSharingInput {
  isPublic: boolean
  sharedUsers?: Array<{
    email: string
    role: ShareRole
  }>
  email?: string
  role?: ShareRole
}

export interface ShareTokenResult {
  isPublic: boolean
  token: string | null
  shareUrl: string | null
  sharedWith?: SharedUser[]
}

export interface PublicFormDetail {
  id: number
  name: string
  description: string | null
  schemaContent: any
}
