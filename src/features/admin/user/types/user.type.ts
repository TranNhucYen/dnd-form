export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  avatarUrl?: string
}

export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
  status?: UserStatus
}
