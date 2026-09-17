'use server'

import { AdminTemplate, Category, UpdateTemplateInput } from '../types/template.type'
import { templateService } from '../services/template.service'

export async function getTemplatesAction(): Promise<AdminTemplate[]> {
  try {
    return await templateService.getTemplates()
  } catch {
    throw new Error('Không thể tải danh sách biểu mẫu mẫu')
  }
}

export async function updateTemplateAction(
  id: number,
  data: UpdateTemplateInput
): Promise<AdminTemplate | null> {
  try {
    return await templateService.updateTemplate(id, data)
  } catch {
    throw new Error('Không thể cập nhật biểu mẫu mẫu')
  }
}

export async function getCategoriesAction(): Promise<Category[]> {
  try {
    return await templateService.getCategories()
  } catch {
    throw new Error('Không thể tải danh sách danh mục')
  }
}
