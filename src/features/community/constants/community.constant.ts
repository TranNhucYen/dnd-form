import { ContributionStatus } from '../types/community.type'

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  [ContributionStatus.PENDING]: 'Chờ xét duyệt',
  [ContributionStatus.APPROVED]: 'Đã duyệt',
  [ContributionStatus.REJECTED]: 'Bị từ chối',
} as const
