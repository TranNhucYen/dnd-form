'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { UnauthorizedError, ForbiddenError } from '@/shared/errors'
import { User, CreateUserInput, UserStatus, UserRole, ActionResponse } from '../types/user.type'
import { userService } from '../services/user.service'

/** Xác thực và đảm bảo chỉ super admin mới có quyền thực thi */
async function assertSuperAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) throw new UnauthorizedError('Cần đăng nhập để thực hiện thao tác này')

  const user = await verifyJwtToken(token)
  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    throw new ForbiddenError('Bạn không có quyền thực hiện thao tác này')
  }

  if (user.status === 'blocked') {
    cookieStore.delete('auth_token')
    throw new ForbiddenError('Tài khoản của bạn đã bị khóa', 'ACCOUNT_BLOCKED')
  }
}

export async function getUsersAction(): Promise<ActionResponse<User[]>> {
  try {
    await assertSuperAdmin()
    const data = await userService.getUsers()
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:getUsersAction')
  }
}

export async function updateUserStatusAction(id: number, status: UserStatus): Promise<ActionResponse<User | null>> {
  try {
    await assertSuperAdmin()
    const data = await userService.updateUserStatus(id, status)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:updateUserStatusAction')
  }
}

export async function createUserAction(input: CreateUserInput): Promise<ActionResponse<User>> {
  try {
    await assertSuperAdmin()
    const data = await userService.createUser(input)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:createUserAction')
  }
}
