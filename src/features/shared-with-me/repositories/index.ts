import { isMockMode } from '@/lib/config'
import {
  type ISharedWithMeRepository,
  drizzleSharedWithMeRepository,
} from './shared-with-me.repository'
import { sharedWithMeMockRepository } from './shared-with-me.mock.repository'

export const sharedWithMeRepository: ISharedWithMeRepository = isMockMode()
  ? sharedWithMeMockRepository
  : drizzleSharedWithMeRepository

export * from './shared-with-me.repository'
