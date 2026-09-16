import { IUserRepository } from './user.repository'
import { userMockRepository } from './user.mock.repository'

export const userRepository: IUserRepository = userMockRepository
export const userManagerRepository: IUserRepository = userMockRepository

export * from './user.repository'
export * from './user.mock.repository'
