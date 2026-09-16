import { AdminUser, CreateUserInput, UserStatus } from '../types/user.type'
import { userRepository } from '../repositories'

export const userService = {
  async getUsers(): Promise<AdminUser[]> {
    return await userRepository.getUsers()
  },

  async getUserById(id: number): Promise<AdminUser | null> {
    return await userRepository.getUserById(id)
  },

  async updateUserStatus(id: number, status: UserStatus): Promise<AdminUser | null> {
    return await userRepository.updateUserStatus(id, status)
  },

  async createUser(input: CreateUserInput): Promise<AdminUser> {
    return await userRepository.createUser(input)
  },
}

export const userManagerService = userService
