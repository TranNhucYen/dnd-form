import { AdminTemplate, TemplateStatus, UpdateTemplateInput } from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { templateRepository } from '../repositories'
import { notificationService } from '@/features/notifications/services/notification.service'
import { ValidationError, NotFoundError, InternalError } from '@/shared/errors'

export const templateService = {
  async getTemplates(): Promise<AdminTemplate[]> {
    return await templateRepository.getTemplates()
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

    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationError('Tên biểu mẫu không được để trống.')
    }

    if (data.review_status === TemplateStatus.REJECTED && (!data.rejectReason || !data.rejectReason.trim())) {
      throw new ValidationError('Vui lòng nhập lý do từ chối duyệt biểu mẫu.')
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
