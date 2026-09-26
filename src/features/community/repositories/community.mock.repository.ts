import { ICommunityRepository } from './community.repository'
import {
  ContributionItem,
  ContributionStatus,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
} from '../types/community.type'

let mockMyContributions: ContributionItem[] = [
  {
    id: 1,
    sourceFormId: 1,
    title: 'Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026',
    description: 'Mẫu khảo sát trải nghiệm dịch vụ khách hàng với các thang đo chỉ số hài lòng.',
    categoryName: 'Khảo sát & Ý kiến',
    status: ContributionStatus.APPROVED,
    submittedAt: '2026-08-05T09:00:00Z',
    reviewedAt: '2026-08-06T14:30:00Z',
    clonesCount: 142,
  },
  {
    id: 2,
    sourceFormId: 2,
    title: 'Đơn xin nghỉ phép - Phòng Kỹ thuật',
    description: 'Biểu mẫu đăng ký nghỉ phép có bàn giao công việc chi tiết.',
    categoryName: 'Hành chính - Nhân sự',
    status: ContributionStatus.PENDING,
    submittedAt: '2026-08-18T16:20:00Z',
  },
  {
    id: 3,
    sourceFormId: 4,
    title: 'Biên bản bàn giao thiết bị làm việc',
    description: 'Ghi nhận danh sách laptop và phụ kiện bàn giao.',
    categoryName: 'Hành chính - Nhân sự',
    status: ContributionStatus.REJECTED,
    submittedAt: '2026-08-10T11:15:00Z',
    reviewedAt: '2026-08-11T09:00:00Z',
    feedback: 'Biểu mẫu chưa đáp ứng tiêu chuẩn cộng đồng vì các lý do sau:\n1. Thiếu các điều khoản cam kết bảo quản tài sản và quy định bồi thường khi làm mất/hỏng hóc.\n2. Cần phân loại rõ thông số kỹ thuật (Số serial, tình trạng vật lý, phụ kiện kèm theo).\n\nVui lòng cập nhật lại biểu mẫu cá nhân và gửi xét duyệt lại.',
    guidelines: [
      'Kiểm tra tình trạng thiết bị trước khi bàn giao',
      'Điền đầy đủ số Serial và cấu hình máy',
      'Đại diện hai bên ký xác nhận vào biên bản',
    ],
  },
]

const mockCategories: CommunityCategory[] = [
  { id: 2, name: 'Hành chính - Nhân sự', slug: 'hanh-chinh-nhan-su' },
  { id: 3, name: 'Hợp đồng - Pháp lý', slug: 'hop-dong-phap-ly' },
  { id: 4, name: 'Khảo sát & Ý kiến', slug: 'khao-sat-y-kien' },
  { id: 5, name: 'Tài chính - Kế toán', slug: 'tai-chinh-ke-toan' },
  { id: 6, name: 'Giáo dục & Đào tạo', slug: 'giao-duc-dao-tao' },
  { id: 7, name: 'Sự kiện & Hội thảo', slug: 'su-kien-hoi-thao' },
  { id: 8, name: 'Khác', slug: 'khac' },
]

const mockUserForms: UserFormOption[] = [
  { id: 1, title: 'Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026' },
  { id: 2, title: 'Đơn xin nghỉ phép - Phòng Kỹ thuật' },
  { id: 4, title: 'Biên bản bàn giao thiết bị làm việc' },
  { id: 6, title: 'Phiếu đánh giá hiệu suất nhân viên cuối năm' },
]

export const communityMockRepository: ICommunityRepository = {
  async getCategories(): Promise<CommunityCategory[]> {
    return [...mockCategories]
  },

  async getUserFormsForContribute(_userId: number): Promise<UserFormOption[]> {
    return [...mockUserForms]
  },

  async getMyContributions(_userId: number): Promise<ContributionItem[]> {
    return [...mockMyContributions]
  },

  async submitContribution(_userId: number, input: ContributeFormInput): Promise<ContributionItem> {

    const newId = Math.max(...mockMyContributions.map((c) => c.id), 0) + 1
    const foundCat = mockCategories.find((c) => c.id === input.categoryId)
    const newContribution: ContributionItem = {
      id: newId,
      sourceFormId: input.sourceFormId,
      title: input.title,
      description: input.description || '',
      categoryId: input.categoryId,
      categoryName: foundCat ? foundCat.name : input.categoryName || 'Khác',
      status: ContributionStatus.PENDING,
      submittedAt: new Date().toISOString(),
      guidelines: input.guidelines || [],
      clonesCount: 0,
    }
    mockMyContributions = [newContribution, ...mockMyContributions]
    return { ...newContribution }
  },
}
