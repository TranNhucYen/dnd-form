export { UserRole, UserStatus, type AuthUser } from '@/shared/types/user.type'
export type { ActionResponse } from '@/shared/types/action.type'

export interface UserLogin {
  email: string
  password: string
}

export interface UserRegister extends UserLogin {
  fullName: string
  confirmPassword?: string
}
