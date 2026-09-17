import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'
import { categoryRepository } from '../repositories'

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return await categoryRepository.getCategories()
  },

  async getCategoryById(id: number): Promise<Category | null> {
    return await categoryRepository.getCategoryById(id)
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    return await categoryRepository.createCategory(data)
  },

  async updateCategory(id: number, data: UpdateCategoryInput): Promise<Category | null> {
    return await categoryRepository.updateCategory(id, data)
  },

  async deleteCategory(id: number): Promise<boolean> {
    return await categoryRepository.deleteCategory(id)
  },
}
