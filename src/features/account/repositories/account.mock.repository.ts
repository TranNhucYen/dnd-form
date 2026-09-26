import { IAccountRepository } from './account.repository'
import { UserProfile, UpdateProfileInput } from '../types/account.type'

let mockProfile: UserProfile = {
  id: 101,
  name: 'Trần Nhực Yên',
  email: 'yen.tran@dragform.io',
  joinedAt: '15/07/2026',
  formsCount: 12,
  contributionsCount: 3,
}

let mockPasswordHash = '$2b$10$wT9r3eWjQ7Q5B5H9zL9Q.OTg4i8N5uN9p3fE8yU0yG6J5j9lK8r4m'

export const mockAccountRepository: IAccountRepository = {
  async getProfile(): Promise<UserProfile | null> {
    return { ...mockProfile }
  },
  async updateProfile(_userId: number, input: UpdateProfileInput): Promise<boolean> {
    mockProfile.name = input.name.trim()
    return true
  },
  async getUserPassword(): Promise<string | null> {
    return mockPasswordHash
  },
  async updatePassword(_userId: number, hashedPassword: string): Promise<boolean> {
    mockPasswordHash = hashedPassword
    return true
  },
}
