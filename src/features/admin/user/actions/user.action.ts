'use server'

import { AdminUser, CreateUserInput, UserStatus } from '../types/user.type'
import { userService } from '../services/user.service'

export async function getUsersAction(): Promise<AdminUser[]> {
  try {
    return await userService.getUsers()
  } catch {
    throw new Error('Không thể tải danh sách người dùng')
  }
}

export async function updateUserStatusAction(id: number, status: UserStatus): Promise<AdminUser | null> {
  try {
    return await userService.updateUserStatus(id, status)
  } catch {
    throw new Error('Không thể cập nhật trạng thái người dùng')
  }
}

export async function createUserAction(input: CreateUserInput): Promise<AdminUser> {
  try {
    return await userService.createUser(input)
  } catch {
    throw new Error('Không thể thêm người dùng')
  }
}
