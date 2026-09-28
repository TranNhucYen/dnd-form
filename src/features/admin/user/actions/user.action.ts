'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { User, CreateUserInput, UserStatus, UserRole } from '../types/user.type'
import { userService } from '../services/user.service'

/** Xác thực và đảm bảo chỉ super admin mới có quyền thực thi */
async function assertSuperAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) throw new Error('Cần đăng nhập để thực hiện thao tác này')

  const user = await verifyJwtToken(token)
  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    throw new Error('Bạn không có quyền thực hiện thao tác này')
  }
}

export async function getUsersAction(): Promise<User[]> {
  await assertSuperAdmin()
  return await userService.getUsers()
}

export async function updateUserStatusAction(id: number, status: UserStatus): Promise<User | null> {
  await assertSuperAdmin()
  return await userService.updateUserStatus(id, status)
}

export async function createUserAction(input: CreateUserInput): Promise<User> {
  await assertSuperAdmin()
  return await userService.createUser(input)
}
