import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'
import { TemplateReviewStatus } from '@/shared/types/template.type'
import type { Category } from '@/shared/types/category.type'
import type { SchemaMediaItem } from '@/shared/types/media.type'

export { TemplateReviewStatus as ContributionStatus } from '@/shared/types/template.type'
export type { Category as CommunityCategory } from '@/shared/types/category.type'
export type { ActionResponse } from '@/shared/types/action.type'

export interface UserFormOption {
  id: number
  title: string
}

export interface ContributionItem {
  id: number
  sourceFormId?: number
  title: string
  description: string
  categoryId?: number
  categoryName: string
  status: TemplateReviewStatus
  statusLabel?: string
  submittedAt: Date | string
  reviewedAt?: Date | string
  feedback?: string
  clonesCount?: number
  guidelines?: string[]
}

export interface ContributeFormInput {
  sourceFormId: number
  title: string
  description?: string
  categoryId: number
  categoryName?: string
  guidelines?: string[]
}

export interface SourceFormData {
  formId: number
  schemaId: number
  schemaContent: FormSchemaJson
  userStatus: 'active' | 'blocked'
  mediaList: SchemaMediaItem[]
}

export interface CreateContributionTemplateParams {
  userId: number
  input: ContributeFormInput
  schemaContent: FormSchemaJson
  mediaList: SourceFormData['mediaList']
}
