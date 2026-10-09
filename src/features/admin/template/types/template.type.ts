import type { Category } from '../../category/types/category.type'
import { TemplateReviewStatus } from '@/shared/types/template.type'

export { TemplateReviewStatus, TemplateReviewStatus as TemplateStatus } from '@/shared/types/template.type'
export type { ActionResponse } from '@/shared/types/action.type'

export interface TemplatePaginationParams {
  page?: number
  pageSize?: number
  search?: string
  status?: 'all' | TemplateReviewStatus
}

export interface TemplateCounts {
  all: number
  pending: number
  approved: number
  rejected: number
}

export interface TemplatePaginatedResult {
  items: AdminTemplate[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  counts: TemplateCounts
}

export const TEMPLATE_STATUS_LABELS: Record<TemplateReviewStatus, string> = {
  [TemplateReviewStatus.PENDING]: 'Chờ duyệt',
  [TemplateReviewStatus.APPROVED]: 'Chấp nhận',
  [TemplateReviewStatus.REJECTED]: 'Từ chối',
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
  review_status: TemplateReviewStatus
  status: TemplatePublishStatus
  approvedBy?: string
  approvedByEmail?: string
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
  review_status?: TemplateReviewStatus
  status?: TemplatePublishStatus
  approvedBy?: string
  approvedByEmail?: string
  rejectReason?: string
}
