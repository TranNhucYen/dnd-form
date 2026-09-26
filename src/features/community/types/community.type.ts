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
