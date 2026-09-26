import { ICommunityRepository, drizzleCommunityRepository } from './community.repository'
import { communityMockRepository } from './community.mock.repository'
import { isMockMode } from '@/lib/config'

export const communityRepository = isMockMode()
  ? communityMockRepository
  : drizzleCommunityRepository

