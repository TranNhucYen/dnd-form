import { INotificationRepository } from './notification.repository'
import { AppNotification, NotificationType } from '../types/notification.type'

let mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: NotificationType.FORM_SHARED,
    title: 'Biểu mẫu mới được chia sẻ',
    message: 'Nguyễn Văn A đã chia sẻ biểu mẫu "Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026" với quyền Chỉnh sửa (Editor).',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'notif-2',
    type: NotificationType.COMMUNITY_REVIEW,
    title: 'Biểu mẫu cộng đồng đã được duyệt',
    message: 'Chúc mừng! Biểu mẫu "Khảo sát nhu cầu đào tạo nội bộ doanh nghiệp" của bạn đã được ban quản trị phê duyệt và đăng tải lên Kho cộng đồng.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'notif-3',
    type: NotificationType.ROLE_UPDATED,
    title: 'Thay đổi quyền truy cập biểu mẫu',
    message: 'Quyền truy cập của bạn đối với biểu mẫu "Hợp đồng lao động thử việc 2 tháng" đã được nâng cấp lên quyền Quản trị viên.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notif-4',
    type: NotificationType.COMMUNITY_REVIEW,
    title: 'Yêu cầu chỉnh sửa biểu mẫu đóng góp',
    message: 'Biểu mẫu "Biên bản bàn giao thiết bị làm việc" cần bổ sung thêm mô tả chi tiết và quy định trách nhiệm trước khi được duyệt lại.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'notif-5',
    type: NotificationType.SYSTEM_UPDATE,
    title: 'Cập nhật phiên bản mới DragForm v1.2',
    message: 'Trình chỉnh sửa Form Editor vừa bổ sung thêm các trường: Đánh giá sao, Tải tệp đính kèm và Định dạng bảng kéo thả linh hoạt.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
]

export const notificationMockRepository: INotificationRepository = {
  async findAll(): Promise<AppNotification[]> {
    return [...mockNotifications]
  },

  async delete(id: string): Promise<boolean> {
    const initialLen = mockNotifications.length
    mockNotifications = mockNotifications.filter((n) => n.id !== id)
    return mockNotifications.length < initialLen
  },

  async deleteAll(): Promise<boolean> {
    mockNotifications = []
    return true
  },
}
