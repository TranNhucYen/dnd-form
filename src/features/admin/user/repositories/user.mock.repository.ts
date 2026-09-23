import { IUserRepository } from './user.repository'
import { AdminUser, CreateUserInput, UserRole, UserStatus } from '../types/user.type'

export let mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Trần Nhực Yên',
    email: 'yen.tran@dragform.io',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '15/07/2026',
  },
  {
    id: 2,
    name: 'Nguyễn Văn An',
    email: 'vanan.nguyen@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '18/07/2026',
  },
  {
    id: 3,
    name: 'Lê Thị Thu',
    email: 'thule.design@gmail.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '22/07/2026',
  },
  {
    id: 4,
    name: 'Phạm Minh Tuấn',
    email: 'tuanpham@techcorp.vn',
    role: UserRole.USER,
    status: UserStatus.BLOCKED,
    createdAt: '01/08/2026',
  },
  {
    id: 5,
    name: 'Hoàng Quốc Bảo',
    email: 'bao.hoang@startup.io',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '10/08/2026',
  },
  {
    id: 6,
    name: 'Đặng Mai Phương',
    email: 'phuong.dang@agency.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '14/08/2026',
  },
  {
    id: 7,
    name: 'Vũ Đức Thịnh',
    email: 'thinh.vu@spam-domain.org',
    role: UserRole.USER,
    status: UserStatus.BLOCKED,
    createdAt: '20/08/2026',
  },
  {
    id: 8,
    name: 'Đỗ Hoàng Nam',
    email: 'nam.do@fintech.vn',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '24/08/2026',
  },
  {
    id: 9,
    name: 'Bùi Thảo Linh',
    email: 'linh.bui@creative.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '28/08/2026',
  },
  {
    id: 10,
    name: 'Nguyễn Minh Châu',
    email: 'chau.nguyen@enterprise.io',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '02/09/2026',
  },
  {
    id: 11,
    name: 'Phan Gia Hưng',
    email: 'hung.phan@phishing-alert.net',
    role: UserRole.USER,
    status: UserStatus.BLOCKED,
    createdAt: '05/09/2026',
  },
  {
    id: 12,
    name: 'Trịnh Kim Chi',
    email: 'chi.trinh@edu-survey.org',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '08/09/2026',
  },
  {
    id: 13,
    name: 'Huỳnh Nhật Quang',
    email: 'quang.huynh@logistics.vn',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '10/09/2026',
  },
  {
    id: 14,
    name: 'Đinh Bích Ngọc',
    email: 'ngoc.dinh@marketing-pro.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '11/09/2026',
  },
  {
    id: 15,
    name: 'Dương Văn Khoa',
    email: 'khoa.duong@violator.co',
    role: UserRole.USER,
    status: UserStatus.BLOCKED,
    createdAt: '12/09/2026',
  },
  {
    id: 16,
    name: 'Tạ Thu Trang',
    email: 'trang.ta@admin-team.io',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '13/09/2026',
  },
  {
    id: 17,
    name: 'Lương Đức Trọng',
    email: 'trong.luong@builder.dev',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '14/09/2026',
  },
  {
    id: 18,
    name: 'Cao Mỹ Duyên',
    email: 'duyen.cao@hospital-hr.vn',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '15/09/2026',
  },
]

export const userMockRepository: IUserRepository = {
  async getUsers(): Promise<AdminUser[]> {
    return [...mockAdminUsers]
  },

  async getUserById(id: number): Promise<AdminUser | null> {
    const found = mockAdminUsers.find((u) => u.id === id)
    return found ? { ...found } : null
  },

  async updateUserStatus(
    id: number,
    status: UserStatus
  ): Promise<AdminUser | null> {
    const userIndex = mockAdminUsers.findIndex((u) => u.id === id)
    if (userIndex === -1) return null

    // Do not allow blocking superAdmin
    if (
      mockAdminUsers[userIndex].role === UserRole.SUPER_ADMIN &&
      status === UserStatus.BLOCKED
    ) {
      return { ...mockAdminUsers[userIndex] }
    }

    mockAdminUsers[userIndex] = {
      ...mockAdminUsers[userIndex],
      status,
    }
    return { ...mockAdminUsers[userIndex] }
  },

  async createUser(input: CreateUserInput): Promise<AdminUser> {
    const nextId =
      mockAdminUsers.length > 0
        ? Math.max(...mockAdminUsers.map((u) => u.id)) + 1
        : 1
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const createdAt = `${dd}/${mm}/${yyyy}`

    const newUser: AdminUser = {
      id: nextId,
      name: input.name.trim(),
      email: input.email.trim(),
      role: input.role,
      status: input.status ?? UserStatus.ACTIVE,
      createdAt,
    }

    mockAdminUsers = [newUser, ...mockAdminUsers]
    return { ...newUser }
  },
}

export const userManagerMockRepository = userMockRepository
