export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

/** Thông tin người dùng sau khi xác thực hoặc trong payload JWT */
export interface AuthUser {
  id: number
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface BaseUserSummary {
  id: number
  fullName: string
  email: string
}
