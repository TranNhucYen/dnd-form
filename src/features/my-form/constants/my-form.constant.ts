import { ShareRole } from '../types/my-form.type'

export const SHARE_ROLE_LABELS: Record<ShareRole, string> = {
  [ShareRole.VIEW]: 'Người xem',
  [ShareRole.EDIT]: 'Người chỉnh sửa',
} as const
