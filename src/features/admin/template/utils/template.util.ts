import { AdminTemplate, TemplateStatus } from '../types/template.type'
import { formatDate } from '@/shared/utils'

export const formatAdminTemplate = (r: Record<string, any>): AdminTemplate => ({
  id: r.id,
  title: r.name,
  creatorName: r.creatorName || 'Người dùng',
  creatorEmail: r.creatorEmail || undefined,
  categoryId: r.categoryId,
  category: r.categoryId
    ? { id: r.categoryId, name: r.categoryName || 'Khác', slug: r.categorySlug || '' }
    : undefined,
  isPaid: r.pricingType === 'paid',
  description: r.description || '',
  guidelines: Array.isArray(r.guideline) ? r.guideline : [],
  review_status: (r.reviewStatus as TemplateStatus) || TemplateStatus.PENDING,
  status: r.status === 'blocked' ? 'block' : r.status === 'active' ? 'active' : null,
  approvedBy: r.approverName || undefined,
  approvedByEmail: r.approverEmail || undefined,
  rejectReason: r.rejectionReason || undefined,
  downloads: r.downloads || 0,
  createdAt: formatDate(r.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric' }),
})
