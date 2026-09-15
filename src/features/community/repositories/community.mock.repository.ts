import { ICommunityRepository } from './community.repository'
import {
  CommunityTemplate,
  ContributionItem,
  ContributionStatus,
  ContributeFormInput,
} from '../types/community.type'

let mockCommunityTemplates: CommunityTemplate[] = [
  {
    id: 101,
    title: 'Khảo sát nhu cầu đào tạo nội bộ doanh nghiệp',
    description: 'Mẫu khảo sát thu thập nhu cầu học tập và nâng cao kỹ năng chuyên môn của nhân viên trong tổ chức.',
    categoryId: 1,
    categoryName: 'Hành chính - Nhân sự',
    authorId: 'u201',
    authorName: 'Trần Minh Tuấn',
    authorAvatar: 'TM',
    clonesCount: 342,
    fieldsCount: 8,
    tags: ['Khảo sát', 'Đào tạo', 'Nhân sự'],
    createdAt: '2026-07-15T08:00:00Z',
    updatedAt: '2026-08-01T10:30:00Z',
  },
  {
    id: 102,
    title: 'Đăng ký tham gia Sự kiện & Workshop Công nghệ',
    description: 'Biểu mẫu chuẩn thu thập thông tin người tham dự, lựa chọn phiên thảo luận và hình thức thanh toán vé.',
    categoryId: 6,
    categoryName: 'Sự kiện & Hội thảo',
    authorId: 'u202',
    authorName: 'Lê Hoàng Yến',
    authorAvatar: 'LH',
    clonesCount: 518,
    fieldsCount: 10,
    tags: ['Sự kiện', 'Workshop', 'Check-in'],
    createdAt: '2026-07-20T14:20:00Z',
    updatedAt: '2026-08-10T09:15:00Z',
  },
  {
    id: 103,
    title: 'Phiếu thu thập ý kiến phụ huynh đầu năm học',
    description: 'Mẫu thu thập thông tin liên lạc, tình trạng sức khỏe và nguyện vọng của phụ huynh đối với học sinh.',
    categoryId: 5,
    categoryName: 'Giáo dục & Đào tạo',
    authorId: 'u203',
    authorName: 'Phạm Thu Hà',
    authorAvatar: 'PT',
    clonesCount: 195,
    fieldsCount: 7,
    tags: ['Giáo dục', 'Phụ huynh', 'Học sinh'],
    createdAt: '2026-08-02T11:00:00Z',
    updatedAt: '2026-08-12T16:00:00Z',
  },
  {
    id: 104,
    title: 'Hợp đồng dịch vụ tư vấn giải pháp CNTT',
    description: 'Mẫu hợp đồng khung dịch vụ tư vấn kỹ thuật, quy định rõ phạm vi công việc, mốc bàn giao và cam kết bảo mật.',
    categoryId: 2,
    categoryName: 'Hợp đồng - Pháp lý',
    authorId: 'u204',
    authorName: 'Vũ Đức Mạnh',
    authorAvatar: 'VD',
    clonesCount: 276,
    fieldsCount: 12,
    tags: ['Hợp đồng', 'CNTT', 'Pháp lý'],
    createdAt: '2026-07-28T09:40:00Z',
    updatedAt: '2026-08-14T15:20:00Z',
  },
  {
    id: 105,
    title: 'Đề xuất tạm ứng và thanh toán công tác phí',
    description: 'Biểu mẫu kê khai chi tiết các khoản chi công tác, kèm bảng tính tự động và danh mục chứng từ đính kèm.',
    categoryId: 4,
    categoryName: 'Tài chính - Kế toán',
    authorId: 'u205',
    authorName: 'Ngô Thanh Hằng',
    authorAvatar: 'NT',
    clonesCount: 420,
    fieldsCount: 9,
    tags: ['Tài chính', 'Công tác phí', 'Kế toán'],
    createdAt: '2026-06-18T10:15:00Z',
    updatedAt: '2026-08-05T13:45:00Z',
  },
  {
    id: 106,
    title: 'Đánh giá mức độ hài lòng khách hàng sau dịch vụ',
    description: 'Mẫu khảo sát CSAT và NPS ngắn gọn với thanh đánh giá sao và câu hỏi mở lấy phản hồi trải nghiệm.',
    categoryId: 3,
    categoryName: 'Khảo sát & Ý kiến',
    authorId: 'u206',
    authorName: 'Đặng Quốc Bảo',
    authorAvatar: 'DQ',
    clonesCount: 689,
    fieldsCount: 6,
    tags: ['Khảo sát', 'CSAT', 'NPS'],
    createdAt: '2026-07-10T08:30:00Z',
    updatedAt: '2026-08-16T17:00:00Z',
  },
]

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
    feedback: 'Mô tả biểu mẫu cần chi tiết hơn và vui lòng bổ sung thêm các điều khoản cam kết bảo quản tài sản trước khi gửi lại.',
  },
]

export const communityMockRepository: ICommunityRepository = {
  async getCommunityTemplates(): Promise<CommunityTemplate[]> {
    return [...mockCommunityTemplates]
  },

  async getTemplateById(id: number): Promise<CommunityTemplate | null> {
    const item = mockCommunityTemplates.find((t) => t.id === id)
    return item ? { ...item } : null
  },

  async getMyContributions(): Promise<ContributionItem[]> {
    return [...mockMyContributions]
  },

  async submitContribution(input: ContributeFormInput): Promise<ContributionItem> {
    const newId = Math.max(...mockMyContributions.map((c) => c.id), 0) + 1
    const newContribution: ContributionItem = {
      id: newId,
      sourceFormId: input.sourceFormId,
      title: input.title,
      description: input.description || '',
      categoryName: input.categoryName || 'Khác',
      status: ContributionStatus.PENDING,
      submittedAt: new Date().toISOString(),
    }
    mockMyContributions = [newContribution, ...mockMyContributions]
    return { ...newContribution }
  },

  async useCommunityTemplate(id: number): Promise<{ newFormId: number; title: string }> {
    const template = mockCommunityTemplates.find((t) => t.id === id)
    if (template) {
      template.clonesCount += 1
    }
    const newFormId = Date.now()
    return {
      newFormId,
      title: template ? `${template.title} (Từ Cộng đồng)` : 'Biểu mẫu cộng đồng',
    }
  },
}
