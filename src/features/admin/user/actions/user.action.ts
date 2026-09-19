'use server'

import { User, CreateUserInput, UserStatus } from '../types/user.type'
import { userService } from '../services/user.service'

export async function getUsersAction(): Promise<User[]> {
  return await userService.getUsers()
}

export async function updateUserStatusAction(id: number, status: UserStatus): Promise<User | null> {
  return await userService.updateUserStatus(id, status)
}

export async function createUserAction(input: CreateUserInput): Promise<User> {
  return await userService.createUser(input)
}
