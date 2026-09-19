import { UserRole, UserStatus } from '@/shared/types/user.type'

export interface UserLogin {
  email: string
  password: string
}

export interface UserRegister extends UserLogin {
  fullName: string
}

export interface AuthUser {
  id: number
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}
