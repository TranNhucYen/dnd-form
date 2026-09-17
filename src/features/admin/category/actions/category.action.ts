'use server'

import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'
import { categoryService } from '../services/category.service'

export async function getCategoriesAction(): Promise<Category[]> {
  try {
    return await categoryService.getCategories()
  } catch {
    throw new Error('Không thể tải danh sách loại biểu mẫu')
  }
}

export async function createCategoryAction(data: CreateCategoryInput): Promise<Category> {
  try {
    return await categoryService.createCategory(data)
  } catch {
    throw new Error('Không thể tạo loại biểu mẫu mới')
  }
}


// Đổi tên
export async function updateCategoryAction(id: number, data: UpdateCategoryInput): Promise<Category | null> {
  try {
    return await categoryService.updateCategory(id, data)
  } catch {
    throw new Error('Không thể cập nhật tên loại biểu mẫu')
  }
}

export async function deleteCategoryAction(id: number): Promise<boolean> {
  try {
    return await categoryService.deleteCategory(id)
  } catch {
    throw new Error('Không thể xóa loại biểu mẫu')
  }
}
