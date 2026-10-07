export { UserRole, UserStatus } from '@/shared/types/user.type'
import { UserRole, UserStatus } from '@/shared/types/user.type'
export type { ActionResponse } from '@/shared/types/action.type'

export interface User {
  id: number
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  avatarUrl?: string
}

export interface CreateUserInput {
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
  password?: string
}
