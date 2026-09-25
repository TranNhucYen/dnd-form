export enum ShareRole {
  VIEW = 'view',
  EDIT = 'edit',
}

export interface SharedUser {
  id: string
  email: string
  role: ShareRole
  addedAt: Date | string
}

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

/** Cấu trúc phản hồi chuẩn của Server Action */
export interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}
