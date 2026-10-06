import { IUserRepository } from './user.repository'
import { userMockRepository } from './user.mock.repository'
import { drizzleUserRepository } from './user.repository'
import { isMockMode } from '@/lib/config'

export const userRepository: IUserRepository = isMockMode()
  ? userMockRepository
  : drizzleUserRepository

export * from './user.repository'
export * from './user.mock.repository'
