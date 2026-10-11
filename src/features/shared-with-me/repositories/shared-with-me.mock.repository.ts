import type { ISharedWithMeRepository } from './shared-with-me.repository'
import type { SharedWithMeItem } from '../types/shared-with-me.type'

const mockSharedForms: SharedWithMeItem[] = [
  {
    id: 101,
    name: 'Biểu mẫu xuất nhập khẩu',
    description: 'Biểu mẫu đăng ký xuất nhập khẩu hàng hóa.',
    permission: 'edit',
    sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ownerId: 2,
    ownerName: 'Nguyễn Văn Quản Lý',
    ownerEmail: 'manager@example.com',
  },
  {
    id: 102,
    name: 'Khảo sát nhu cầu đào tạo nhân viên',
    description: 'Biểu mẫu khảo sát nhu cầu học tập và nâng cao kỹ năng chuyên môn.',
    permission: 'view',
    sharedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ownerId: 3,
    ownerName: 'Trần Thị Nhân Sự',
    ownerEmail: 'hr@example.com',
  },
]

export const sharedWithMeMockRepository: ISharedWithMeRepository = {
  async getSharedWithMeForms(_userId: number): Promise<SharedWithMeItem[]> {
    return [...mockSharedForms]
  },
}
