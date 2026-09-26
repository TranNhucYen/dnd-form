import bcrypt from 'bcrypt'
import { accountRepository } from '../repositories'
import { UserProfile, UpdateProfileInput, ChangePasswordInput } from '../types/account.type'

export const accountService = {
  async getProfile(userId: number): Promise<UserProfile> {
    if (!userId || isNaN(userId)) {
      throw new Error('Người dùng không hợp lệ.')
    }

    let profile: UserProfile | null = null
    try {
      profile = await accountRepository.getProfile(userId)
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin tài khoản id ${userId}:`, error)
      throw new Error('Không thể tải thông tin tài khoản.')
    }

    if (!profile) {
      throw new Error('Tài khoản không tồn tại.')
    }

    return profile
  },

  async updateProfile(userId: number, input: UpdateProfileInput): Promise<UserProfile> {
    if (!userId || isNaN(userId)) {
      throw new Error('Người dùng không hợp lệ.')
    }
    if (!input.name || !input.name.trim()) {
      throw new Error('Họ và tên không được để trống.')
    }

    try {
      const success = await accountRepository.updateProfile(userId, input)
      if (!success) {
        throw new Error('Không thể cập nhật thông tin tài khoản.')
      }
    } catch (error) {
      console.error(`Lỗi khi cập nhật tài khoản id ${userId}:`, error)
      throw error instanceof Error ? error : new Error('Không thể cập nhật thông tin tài khoản.')
    }

    return this.getProfile(userId)
  },

  async changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
    if (!userId || isNaN(userId)) {
      throw new Error('Người dùng không hợp lệ.')
    }
    if (!input.currentPassword) {
      throw new Error('Vui lòng nhập mật khẩu hiện tại.')
    }
    if (!input.newPassword || input.newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự.')
    }
    if (input.newPassword !== input.confirmPassword) {
      throw new Error('Xác nhận mật khẩu mới không khớp.')
    }
    if (input.currentPassword === input.newPassword) {
      throw new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại.')
    }

    let currentHash: string | null = null
    try {
      currentHash = await accountRepository.getUserPassword(userId)
    } catch (error) {
      console.error(`Lỗi khi xác minh mật khẩu user id ${userId}:`, error)
      throw new Error('Đã xảy ra lỗi khi kiểm tra mật khẩu.')
    }

    if (!currentHash) {
      throw new Error('Tài khoản không tồn tại.')
    }

    const isMatch = await bcrypt.compare(input.currentPassword, currentHash)
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không chính xác.')
    }

    const newHashedPassword = await bcrypt.hash(input.newPassword, 10)
    try {
      const success = await accountRepository.updatePassword(userId, newHashedPassword)
      if (!success) {
        throw new Error('Không thể cập nhật mật khẩu.')
      }
    } catch (error) {
      console.error(`Lỗi khi cập nhật mật khẩu user id ${userId}:`, error)
      throw error instanceof Error ? error : new Error('Không thể cập nhật mật khẩu.')
    }
  },
}
