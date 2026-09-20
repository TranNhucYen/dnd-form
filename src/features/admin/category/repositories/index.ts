import { ICategoryRepository, drizzleCategoryRepository } from './category.repository'
import { categoryMockRepository } from './category.mock.repository'
import { isMockMode } from '@/lib/config'

export const categoryRepository: ICategoryRepository = isMockMode()
  ? categoryMockRepository
  : drizzleCategoryRepository

export * from './category.repository'
export * from './category.mock.repository'
