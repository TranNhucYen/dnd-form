import { ICategoryRepository } from './category.repository'
import { categoryMockRepository } from './category.mock.repository'

// Sử dụng categoryMockRepository cho môi trường hiện tại
export const categoryRepository: ICategoryRepository = categoryMockRepository

export * from './category.repository'
export * from './category.mock.repository'
