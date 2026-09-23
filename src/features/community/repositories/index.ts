import { ICommunityRepository } from './community.repository'
import { communityMockRepository } from './community.mock.repository'

export const communityRepository: ICommunityRepository = communityMockRepository
export * from './community.repository'
export * from './community.mock.repository'
