import { User, CreateUserInput, UserStatus, UserRole } from '../types/user.type'
import { userRepository } from '../repositories'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const userService = {
  async getUsers(): Promise<User[]> {
    return await userRepository.getUsers()
  },

  async getUserById(id: number): Promise<User | null> {
    const user = await userRepository.getUserById(id)
    if (!user) {
      throw new Error('Người dùng không tồn tại')
    }
    return user
  },

  async updateUserStatus(id: number, status: UserStatus): Promise<User | null> {
    const existingUser = await userRepository.getUserById(id)
    if (!existingUser) {
      throw new Error('Người dùng không tồn tại')
    }

    if (existingUser.role === UserRole.SUPER_ADMIN && status === UserStatus.BLOCKED) {
      throw new Error('Không thể khóa tài này')
    }

    return await userRepository.updateUserStatus(id, status)
  },

  async createUser(input: CreateUserInput): Promise<User> {
    if (!input.fullName?.trim() || !input.email?.trim()) {
      throw new Error('Họ tên và email không được để trống')
    }

    const existingUser = await userRepository.getUserByEmail(input.email)
    if (existingUser) {
      throw new Error('Email này đã tồn tại')
    }

    // tạo random password bằng crypt
    const plainPassword = input.password?.trim() || crypto.randomBytes(8).toString('hex')
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
    const created = await userRepository.createUser({ ...input, password: hashedPassword })
    if (!created) {
      throw new Error('Tạo người dùng thất bại')
    }

    return created
  },
}
