import { User, CreateUserInput, UserStatus, UserRole } from '../types/user.type'
import { userRepository } from '../repositories'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createUserValidation, updateUserStatusValidation } from '../validation/user.validation'
import { ValidationError, NotFoundError, ForbiddenError, ConflictError, InternalError } from '@/shared/errors'

export const userService = {
  async getUsers(): Promise<User[]> {
    return await userRepository.getUsers()
  },

  async getUserById(id: number): Promise<User | null> {
    const user = await userRepository.getUserById(id)
    if (!user) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    return user
  },

  async updateUserStatus(id: number, status: UserStatus): Promise<User | null> {
    const parsed = updateUserStatusValidation.safeParse({ id, status })
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message)
    }

    const existingUser = await userRepository.getUserById(id)
    if (!existingUser) {
      throw new NotFoundError('Người dùng không tồn tại')
    }

    if (existingUser.role === UserRole.SUPER_ADMIN && status === UserStatus.BLOCKED) {
      throw new ForbiddenError('Không thể khóa tài khoản này')
    }

    return await userRepository.updateUserStatus(id, status)
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const parsed = createUserValidation.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message)
    }

    const validData = parsed.data

    const existingUser = await userRepository.getUserByEmail(validData.email)
    if (existingUser) {
      throw new ConflictError('Email này đã tồn tại')
    }

    const plainPassword = validData.password?.trim() || crypto.randomBytes(8).toString('hex')
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
    const created = await userRepository.createUser({ ...validData, password: hashedPassword })
    if (!created) {
      throw new InternalError('Tạo người dùng thất bại')
    }

    return created
  },
}
