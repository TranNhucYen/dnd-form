'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { Category, CreateCategoryInput, UpdateCategoryInput, ActionResponse } from '../types/category.type'
import { categoryService } from '../services/category.service'

async function getAuthenticatedAdmin(): Promise<
  { userId: number; fullName: string } | { error: string; code: string }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Cần đăng nhập quyền admin để thực hiện thao tác này', code: 'UNAUTHORIZED' }
  }

  const user = await verifyJwtToken(token)
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return { error: 'Phiên làm việc hết hạn hoặc không có quyền admin', code: 'FORBIDDEN' }
  }

  if (user.status === 'blocked') {
    cookieStore.delete('auth_token')
    return { error: 'Tài khoản của bạn đã bị khóa', code: 'ACCOUNT_BLOCKED' }
  }

  return { userId: user.id, fullName: user.fullName }
}

export async function getCategoriesAction(): Promise<ActionResponse<Category[]>> {
  try {
    const authResult = await getAuthenticatedAdmin()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await categoryService.getCategories()
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:getCategoriesAction')
  }
}

export async function createCategoryAction(data: CreateCategoryInput): Promise<ActionResponse<Category>> {
  try {
    const authResult = await getAuthenticatedAdmin()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const created = await categoryService.createCategory(data)
    return { success: true, data: created }
  } catch (error) {
    return handleActionError(error, 'admin:createCategoryAction')
  }
}

export async function updateCategoryAction(
  id: number,
  data: UpdateCategoryInput
): Promise<ActionResponse<Category | null>> {
  try {
    const authResult = await getAuthenticatedAdmin()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const updated = await categoryService.updateCategory(id, data)
    return { success: true, data: updated }
  } catch (error) {
    return handleActionError(error, 'admin:updateCategoryAction')
  }
}

export async function deleteCategoryAction(id: number): Promise<ActionResponse<boolean>> {
  try {
    const authResult = await getAuthenticatedAdmin()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const deleted = await categoryService.deleteCategory(id)
    return { success: true, data: deleted }
  } catch (error) {
    return handleActionError(error, 'admin:deleteCategoryAction')
  }
}
