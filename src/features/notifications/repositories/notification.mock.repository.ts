import { INotificationRepository } from './notification.repository'
import {
  AppNotification,
  CreateNotificationPayload,
  NotificationType,
} from '../types/notification.type'

let mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 1,
    actorId: 2,
    actorName: 'Nguyễn Văn A',
    type: NotificationType.FORM_SHARED,
    title: 'Biểu mẫu mới được chia sẻ',
    message: 'Nguyễn Văn A đã chia sẻ biểu mẫu "Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026" với quyền Chỉnh sửa (Editor).',
    actionUrl: '/editor',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 1,
    actorId: 101,
    actorName: 'Quản trị viên',
    type: NotificationType.COMMUNITY_REVIEW,
    title: 'Biểu mẫu cộng đồng đã được duyệt',
    message: 'Chúc mừng! Biểu mẫu "Khảo sát nhu cầu đào tạo nội bộ doanh nghiệp" của bạn đã được ban quản trị phê duyệt và đăng tải lên Kho cộng đồng.',
    actionUrl: '/community',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 1,
    actorId: 101,
    actorName: 'Quản trị viên',
    type: NotificationType.COMMUNITY_REVIEW,
    title: 'Biểu mẫu cộng đồng bị từ chối duyệt',
    message: 'Biểu mẫu "Biên bản bàn giao thiết bị làm việc" đã bị từ chối phê duyệt. Lý do: Thiếu hướng dẫn sử dụng chi tiết.',
    actionUrl: '/community',
    metadata: { rejectReason: 'Thiếu hướng dẫn sử dụng chi tiết.' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 1,
    actorId: null,
    actorName: null,
    type: NotificationType.SYSTEM_UPDATE,
    title: 'Cập nhật phiên bản mới DragForm v1.2',
    message: 'Trình chỉnh sửa Form Editor vừa bổ sung thêm các trường: Đánh giá sao, Tải tệp đính kèm và Định dạng bảng kéo thả linh hoạt.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
]

export const notificationMockRepository: INotificationRepository = {
  async findByUserId(userId: number): Promise<AppNotification[]> {
    return mockNotifications.filter((n) => n.userId === userId || n.userId === 1)
  },

  async delete(id: string, userId: number): Promise<boolean> {
    const initialLen = mockNotifications.length
    mockNotifications = mockNotifications.filter(
      (n) => !(n.id === id && (n.userId === userId || n.userId === 1))
    )
    return mockNotifications.length < initialLen
  },

  async deleteAllByUserId(userId: number): Promise<boolean> {
    mockNotifications = mockNotifications.filter(
      (n) => n.userId !== userId && n.userId !== 1
    )
    return true
  },

  async create(payload: CreateNotificationPayload): Promise<AppNotification> {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: payload.userId,
      actorId: payload.actorId || null,
      actorName: null,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      actionUrl: payload.actionUrl || null,
      metadata: payload.metadata || null,
      createdAt: new Date().toISOString(),
    }
    mockNotifications.unshift(newNotif)
    return newNotif
  },

  async findTemplateAuthorId(_templateId: number): Promise<number | null> {
    return 1 // Mock tác giả template có ID = 1
  },
}

