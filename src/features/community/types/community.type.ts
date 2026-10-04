import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

export enum ContributionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface CommunityCategory {
  id: number
  name: string
  slug: string
}

export interface UserFormOption {
  id: number
  title: string
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface ContributionItem {
  id: number
  sourceFormId?: number
  title: string
  description: string
  categoryId?: number
  categoryName: string
  status: ContributionStatus
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
  mediaList: Array<{
    mediaType: 'signature' | 'image' | 'document'
    fileKey: string | null
    fileUrl: string | null
    signatureBase64: string | null
    fileName: string | null
    mimeType: string | null
    fileSize: number | null
  }>
}

export interface CreateContributionTemplateParams {
  userId: number
  input: ContributeFormInput
  schemaContent: FormSchemaJson
  mediaList: SourceFormData['mediaList']
}
