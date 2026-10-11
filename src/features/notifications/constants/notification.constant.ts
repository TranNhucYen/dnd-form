import { ROUTES, DYNAMIC_ROUTES } from '@/shared/constants/routes'

/** Mẫu tiêu đề, nội dung và đường dẫn thông báo */
export const NOTIFICATION_TEMPLATES = {
  COMMUNITY_REVIEW: {
    APPROVED: {
      TITLE: 'Biểu mẫu cộng đồng đã được duyệt',
      MESSAGE: (title: string) => `Biểu mẫu "${title}" của bạn đã được quản trị viên phê duyệt lên Kho cộng đồng.`,
      ACTION_URL: ROUTES.COMMUNITY,
    },
    REJECTED: {
      TITLE: 'Biểu mẫu cộng đồng bị từ chối duyệt',
      MESSAGE: (title: string, reason?: string) =>
        `Biểu mẫu "${title}" đã bị từ chối phê duyệt. Lý do: ${reason?.trim() || 'Không đạt tiêu chuẩn kiểm duyệt'}`,
      ACTION_URL: ROUTES.COMMUNITY,
    },
  },
  FORM_SHARED: {
    TITLE: 'Bạn nhận được quyền truy cập biểu mẫu mới',
    MESSAGE: (actorName: string, formName: string, roleName: string) =>
      `${actorName} đã chia sẻ biểu mẫu "${formName}" cho bạn với quyền ${roleName}.`,
    ACTION_URL: (formId: number) => DYNAMIC_ROUTES.FORM_EDIT(formId),
  },
} as const
