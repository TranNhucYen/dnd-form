import { AdminUser, CreateUserInput, UserStatus } from '../types/user.type'

export interface IUserRepository {
  getUsers(): Promise<AdminUser[]>
  getUserById(id: number): Promise<AdminUser | null>
  updateUserStatus(id: number, status: UserStatus): Promise<AdminUser | null>
  createUser(input: CreateUserInput): Promise<AdminUser>
}

export type IUserManagerRepository = IUserRepository
