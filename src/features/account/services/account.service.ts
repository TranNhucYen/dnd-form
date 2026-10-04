import bcrypt from 'bcrypt'
import { accountRepository } from '../repositories'
import { UserProfile, UpdateProfileInput, ChangePasswordInput } from '../types/account.type'
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  InternalError,
} from '@/shared/errors'

export const accountService = {
  async getProfile(userId: number): Promise<UserProfile> {
    if (!userId || isNaN(userId)) {
      throw new UnauthorizedError('Người dùng không hợp lệ.')
    }

    const profile = await accountRepository.getProfile(userId)
    if (!profile) {
      throw new NotFoundError('Tài khoản không tồn tại.')
    }

    return profile
  },

  async updateProfile(userId: number, input: UpdateProfileInput): Promise<UserProfile> {
    if (!userId || isNaN(userId)) {
      throw new UnauthorizedError('Người dùng không hợp lệ.')
    }
    if (!input.name || !input.name.trim()) {
      throw new ValidationError('Họ và tên không được để trống.')
    }

    const success = await accountRepository.updateProfile(userId, input)
    if (!success) {
      throw new InternalError('Không thể cập nhật thông tin tài khoản.')
    }

    return this.getProfile(userId)
  },

  async changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
    if (!userId || isNaN(userId)) {
      throw new UnauthorizedError('Người dùng không hợp lệ.')
    }
    if (!input.currentPassword) {
      throw new ValidationError('Vui lòng nhập mật khẩu hiện tại.')
    }
    if (!input.newPassword || input.newPassword.length < 6) {
      throw new ValidationError('Mật khẩu mới phải có tối thiểu 6 ký tự.')
    }
    if (input.newPassword !== input.confirmPassword) {
      throw new ValidationError('Xác nhận mật khẩu mới không khớp.')
    }
    if (input.currentPassword === input.newPassword) {
      throw new ValidationError('Mật khẩu mới không được trùng với mật khẩu hiện tại.')
    }

    const currentHash = await accountRepository.getUserPassword(userId)
    if (!currentHash) {
      throw new NotFoundError('Tài khoản không tồn tại.')
    }

    const isMatch = await bcrypt.compare(input.currentPassword, currentHash)
    if (!isMatch) {
      throw new ValidationError('Mật khẩu hiện tại không chính xác.')
    }

    const newHashedPassword = await bcrypt.hash(input.newPassword, 10)
    const success = await accountRepository.updatePassword(userId, newHashedPassword)
    if (!success) {
      throw new InternalError('Không thể cập nhật mật khẩu.')
    }
  },
}
