import { ContributionStatus } from '../types/community.type'

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  [ContributionStatus.PENDING]: 'Chờ xét duyệt',
  [ContributionStatus.APPROVED]: 'Đã duyệt',
  [ContributionStatus.REJECTED]: 'Bị từ chối',
} as const

export const COMMUNITY_CATEGORIES = [
  'Tất cả',
  'Hành chính - Nhân sự',
  'Hợp đồng - Pháp lý',
  'Khảo sát & Ý kiến',
  'Tài chính - Kế toán',
  'Giáo dục & Đào tạo',
  'Sự kiện & Hội thảo',
] as const
