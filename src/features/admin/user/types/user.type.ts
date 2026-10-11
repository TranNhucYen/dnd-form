export { UserRole, UserStatus } from '@/shared/types/user.type'
import { UserRole, UserStatus } from '@/shared/types/user.type'
export type { ActionResponse } from '@/shared/types/action.type'
export type { PaginationParams, PaginatedResult } from '@/shared/types/pagination.type'

export interface UserPaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

export type UserPaginatedResult = import('@/shared/types/pagination.type').PaginatedResult<User>

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
