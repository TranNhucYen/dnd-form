export enum ContributionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface CommunityTemplate {
  id: number
  title: string
  description: string
  categoryId: number
  categoryName: string
  authorId: string | number
  authorName: string
  authorAvatar?: string
  clonesCount: number
  fieldsCount: number
  tags: string[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ContributionItem {
  id: number
  sourceFormId: number
  title: string
  description: string
  categoryName: string
  status: ContributionStatus
  statusLabel?: string
  submittedAt: Date | string
  reviewedAt?: Date | string
  feedback?: string
  clonesCount?: number
}

export interface ContributeFormInput {
  sourceFormId: number
  title: string
  description?: string
  categoryName: string
}
