import {
  AdminTemplate,

  UpdateTemplateInput,
  TemplatePaginationParams,
  TemplatePaginatedResult,
} from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { templateRepository } from '../repositories'
import { notificationService } from '@/features/notifications/services/notification.service'
import { ValidationError, NotFoundError, InternalError } from '@/shared/errors'
import {
  templatePaginationValidation,
  updateTemplateValidation,
} from '../validation/template.validation'

export const templateService = {
  async getTemplates(params?: TemplatePaginationParams): Promise<TemplatePaginatedResult> {
    const parsed = templatePaginationValidation.safeParse(params ?? {})
    const validParams = parsed.success ? parsed.data : params
    return await templateRepository.getTemplates(validParams)
  },

  async getTemplateById(id: number): Promise<AdminTemplate> {
    const template = await templateRepository.getTemplateById(id)
    if (!template) {
      throw new NotFoundError('Biểu mẫu mẫu không tồn tại.')
    }
    return template
  },

  async updateTemplate(
    id: number,
    data: UpdateTemplateInput,
    adminUserId?: number
  ): Promise<AdminTemplate> {
    const existing = await templateRepository.getTemplateById(id)
    if (!existing) {
      throw new NotFoundError('Biểu mẫu mẫu không tồn tại.')
    }

    const parsed = updateTemplateValidation.safeParse(data)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message)
    }

    const updated = await templateRepository.updateTemplate(id, data, adminUserId)
    if (!updated) {
      throw new InternalError('Không thể cập nhật biểu mẫu mẫu.')
    }

    await notificationService.notifyTemplateReview(existing, updated, data, adminUserId)
    return updated
  },

  async getCategories(): Promise<Category[]> {
    return await templateRepository.getCategories()
  },
}
