import { FormStatus, ShareRole } from '../types/my-form.type'

/**
 * Nhãn hiển thị chữ tự nhiên các trạng thái biểu mẫu
 */
export const FORM_STATUS_LABELS: Record<FormStatus, string> = {
  [FormStatus.ACTIVE]: 'Đang sử dụng',
  [FormStatus.DRAFT]: 'Bản nháp',
  [FormStatus.ARCHIVED]: 'Đã lưu trữ',
} as const

/**
 * Nhãn hiển thị chữ tự nhiên các vai trò phân quyền chia sẻ
 */
export const SHARE_ROLE_LABELS: Record<ShareRole, string> = {
  [ShareRole.VIEWER]: 'Người xem',
  [ShareRole.EDITOR]: 'Người chỉnh sửa',
} as const
