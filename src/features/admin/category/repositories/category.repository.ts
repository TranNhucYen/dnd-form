import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>
  getCategoryById(id: number): Promise<Category | null>
  createCategory(data: CreateCategoryInput): Promise<Category>
  updateCategory(id: number, data: UpdateCategoryInput): Promise<Category | null>
  deleteCategory(id: number): Promise<boolean>
}
