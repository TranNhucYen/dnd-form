import { IMyFormRepository } from './my-form.repository'
import { MyForm, FormStatus, ShareRole, SharedUser } from '../types/my-form.type'

let mockForms: MyForm[] = [
  {
    id: 1,
    title: 'Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026',
    description: 'Thu thập ý kiến đóng góp của khách hàng về chất lượng dịch vụ và tính năng mới của sản phẩm.',
    status: FormStatus.ACTIVE,
    fieldsCount: 8,
    responsesCount: 142,
    isPublic: true,
    sharedWith: [
      { id: 'u1', email: 'manager@company.com', role: ShareRole.EDITOR, addedAt: new Date('2026-07-10') },
      { id: 'u2', email: 'analyst@company.com', role: ShareRole.VIEWER, addedAt: new Date('2026-07-12') },
    ],
    createdAt: new Date('2026-07-10'),
    updatedAt: new Date('2026-08-15'),
  },
  {
    id: 2,
    title: 'Đơn xin nghỉ phép - Phòng Kỹ thuật',
    description: 'Biểu mẫu nội bộ dùng để đăng ký ngày nghỉ phép và bàn giao công việc tạm thời trong nhóm.',
    status: FormStatus.ACTIVE,
    fieldsCount: 5,
    responsesCount: 28,
    isPublic: false,
    sharedWith: [
      { id: 'u3', email: 'hr@company.com', role: ShareRole.EDITOR, addedAt: new Date('2026-07-15') },
    ],
    sourceTemplateId: 1,
    sourceTemplateName: 'Đơn xin nghỉ phép',
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-08-10'),
  },
  {
    id: 3,
    title: 'Hợp đồng lao động thử việc 2 tháng',
    description: 'Mẫu hợp đồng thử việc theo quy định mới, đang trong giai đoạn soạn thảo điều khoản.',
    status: FormStatus.DRAFT,
    fieldsCount: 12,
    responsesCount: 0,
    isPublic: false,
    sharedWith: [],
    sourceTemplateId: 4,
    sourceTemplateName: 'Hợp đồng lao động không xác định thời hạn',
    createdAt: new Date('2026-08-01'),
    updatedAt: new Date('2026-08-18'),
  },
  {
    id: 4,
    title: 'Biên bản bàn giao thiết bị làm việc',
    description: 'Biên bản ghi nhận danh sách laptop, màn hình và phụ kiện cấp phát cho nhân sự mới.',
    status: FormStatus.ACTIVE,
    fieldsCount: 6,
    responsesCount: 15,
    isPublic: true,
    sharedWith: [
      { id: 'u4', email: 'it-support@company.com', role: ShareRole.EDITOR, addedAt: new Date('2026-07-20') },
    ],
    sourceTemplateId: 6,
    sourceTemplateName: 'Biên bản bàn giao công việc & tài sản',
    createdAt: new Date('2026-07-20'),
    updatedAt: new Date('2026-08-05'),
  },
  {
    id: 5,
    title: 'Đăng ký tham gia Workshop DragForm 2026',
    description: 'Form đăng ký trực tuyến sự kiện chia sẻ công nghệ biểu mẫu tương tác kéo thả.',
    status: FormStatus.ARCHIVED,
    fieldsCount: 7,
    responsesCount: 350,
    isPublic: false,
    sharedWith: [],
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-07-01'),
  },
  {
    id: 6,
    title: 'Phiếu đánh giá hiệu suất nhân viên cuối năm',
    description: 'Bản nháp bảng câu hỏi tự đánh giá KPI và phản hồi của quản lý trực tiếp.',
    status: FormStatus.DRAFT,
    fieldsCount: 15,
    responsesCount: 0,
    isPublic: false,
    sharedWith: [],
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-19'),
  },
]

export const myFormMockRepository: IMyFormRepository = {
  async findAll(): Promise<MyForm[]> {
    return [...mockForms]
  },

  async findById(id: number): Promise<MyForm | null> {
    const form = mockForms.find((f) => f.id === id)
    return form ? { ...form } : null
  },

  async create(data: any): Promise<MyForm> {
    const newId = Math.max(...mockForms.map((f) => f.id), 0) + 1
    const now = new Date()
    const newForm: MyForm = {
      id: newId,
      title: data.title || 'Biểu mẫu chưa đặt tên',
      description: data.description || '',
      status: data.status || FormStatus.DRAFT,
      fieldsCount: data.fieldsCount || 0,
      responsesCount: 0,
      isPublic: data.isPublic || false,
      sharedWith: data.sharedWith || [],
      sourceTemplateId: data.sourceTemplateId,
      sourceTemplateName: data.sourceTemplateName,
      createdAt: now,
      updatedAt: now,
    }
    mockForms = [newForm, ...mockForms]
    return { ...newForm }
  },

  async update(id: number, data: any): Promise<MyForm | null> {
    const index = mockForms.findIndex((f) => f.id === id)
    if (index === -1) return null

    mockForms[index] = {
      ...mockForms[index],
      ...data,
      updatedAt: new Date(),
    }
    return { ...mockForms[index] }
  },

  async delete(id: number): Promise<boolean> {
    const initialLength = mockForms.length
    mockForms = mockForms.filter((f) => f.id !== id)
    return mockForms.length < initialLength
  },

  async duplicate(
    id: number,
    customData?: { title?: string; description?: string }
  ): Promise<MyForm | null> {
    const original = mockForms.find((f) => f.id === id)
    if (!original) return null

    const newId = Math.max(...mockForms.map((f) => f.id)) + 1
    const now = new Date()
    const duplicated: MyForm = {
      ...original,
      id: newId,
      title: customData?.title?.trim() || `${original.title} (Bản sao)`,
      description: customData?.description !== undefined ? customData.description.trim() || undefined : original.description,
      status: FormStatus.DRAFT,
      responsesCount: 0,
      isPublic: false,
      sharedWith: [],
      createdAt: now,
      updatedAt: now,
    }
    mockForms = [duplicated, ...mockForms]
    return { ...duplicated }
  },

  async updateStatus(id: number, status: FormStatus): Promise<MyForm | null> {
    const index = mockForms.findIndex((f) => f.id === id)
    if (index === -1) return null

    mockForms[index] = {
      ...mockForms[index],
      status,
      updatedAt: new Date(),
    }
    return { ...mockForms[index] }
  },

  async updateSharing(
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ): Promise<MyForm | null> {
    const index = mockForms.findIndex((f) => f.id === id)
    if (index === -1) return null

    mockForms[index] = {
      ...mockForms[index],
      isPublic: sharing.isPublic,
      sharedWith: sharing.sharedWith,
      updatedAt: new Date(),
    }
    return { ...mockForms[index] }
  },
}
