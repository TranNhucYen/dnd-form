'use server'

import { handleActionError } from '@/shared/utils/action.util'
import { requirePermission } from '@/shared/auth/authorization'
import { PERMISSIONS } from '@/shared/auth/permissions'
import { User, CreateUserInput, UserStatus, ActionResponse, UserPaginationParams } from '../types/user.type'
import { PaginatedResult } from '@/shared/types/pagination.type'
import { userService } from '../services/user.service'

export async function getUsersAction(params?: UserPaginationParams): Promise<ActionResponse<PaginatedResult<User>>> {
  try {
    await requirePermission(PERMISSIONS.user.read)
    const data = await userService.getUsers(params)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:getUsersAction')
  }
}

export async function updateUserStatusAction(id: number, status: UserStatus): Promise<ActionResponse<User | null>> {
  try {
    await requirePermission(PERMISSIONS.user.update)
    const data = await userService.updateUserStatus(id, status)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:updateUserStatusAction')
  }
}

export async function createUserAction(input: CreateUserInput): Promise<ActionResponse<User>> {
  try {
    await requirePermission(PERMISSIONS.user.create)
    const data = await userService.createUser(input)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:createUserAction')
  }
}
