export interface Category {
  id: number
  name: string
  slug: string
  createdAt?: string
}

export enum TemplateStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const TEMPLATE_STATUS_LABELS: Record<TemplateStatus, string> = {
  [TemplateStatus.PENDING]: 'Chờ duyệt',
  [TemplateStatus.APPROVED]: 'Chấp nhận',
  [TemplateStatus.REJECTED]: 'Từ chối',
}

export type TemplatePublishStatus = 'active' | 'block' | null

export interface AdminTemplate {
  id: number
  title: string
  creatorName: string
  creatorEmail?: string
  categoryId: number
  category?: Category
  isPaid: boolean
  description: string
  guidelines: string[]
  review_status: TemplateStatus
  status: TemplatePublishStatus
  approvedBy?: string
  rejectReason?: string
  downloads: number
  createdAt: string
}

export interface UpdateTemplateInput {
  title?: string
  categoryId?: number
  category?: Category
  isPaid?: boolean
  description?: string
  guidelines?: string[]
  review_status?: TemplateStatus
  status?: TemplatePublishStatus
  approvedBy?: string
  rejectReason?: string
}
