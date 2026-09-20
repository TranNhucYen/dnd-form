'use server'

import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'
import { categoryService } from '../services/category.service'

export async function getCategoriesAction(): Promise<Category[]> {
  return await categoryService.getCategories()
}

export async function createCategoryAction(data: CreateCategoryInput): Promise<Category> {
  return await categoryService.createCategory(data)
}

export async function updateCategoryAction(id: number, data: UpdateCategoryInput): Promise<Category | null> {
  return await categoryService.updateCategory(id, data)
}

export async function deleteCategoryAction(id: number): Promise<boolean> {
  return await categoryService.deleteCategory(id)
}

