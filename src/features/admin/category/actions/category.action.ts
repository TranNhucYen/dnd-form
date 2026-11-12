'use server'

import { handleActionError } from '@/shared/utils/action.util'
import { requirePermission } from '@/shared/auth/authorization'
import { PERMISSIONS } from '@/shared/auth/permissions'
import { Category, CreateCategoryInput, UpdateCategoryInput, ActionResponse } from '../types/category.type'
import { categoryService } from '../services/category.service'

export async function getCategoriesAction(): Promise<ActionResponse<Category[]>> {
  try {
    await requirePermission(PERMISSIONS.category.read)
    const data = await categoryService.getCategories()
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:getCategoriesAction')
  }
}

export async function createCategoryAction(data: CreateCategoryInput): Promise<ActionResponse<Category>> {
  try {
    await requirePermission(PERMISSIONS.category.create)
    const created = await categoryService.createCategory(data)
    return { success: true, data: created }
  } catch (error) {
    return handleActionError(error, 'admin:createCategoryAction')
  }
}

export async function updateCategoryAction(
  id: number,
  data: UpdateCategoryInput,
): Promise<ActionResponse<Category | null>> {
  try {
    await requirePermission(PERMISSIONS.category.update)
    const updated = await categoryService.updateCategory(id, data)
    return { success: true, data: updated }
  } catch (error) {
    return handleActionError(error, 'admin:updateCategoryAction')
  }
}

export async function deleteCategoryAction(id: number): Promise<ActionResponse<boolean>> {
  try {
    await requirePermission(PERMISSIONS.category.delete)
    const deleted = await categoryService.deleteCategory(id)
    return { success: true, data: deleted }
  } catch (error) {
    return handleActionError(error, 'admin:deleteCategoryAction')
  }
}
