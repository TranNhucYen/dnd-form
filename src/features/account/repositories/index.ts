import { isMockMode } from '@/lib/config'
import { drizzleAccountRepository } from './account.repository'
import { mockAccountRepository } from './account.mock.repository'

export const accountRepository = isMockMode()
  ? mockAccountRepository
  : drizzleAccountRepository

export * from './account.repository'
