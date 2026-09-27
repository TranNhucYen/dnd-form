import { AdminTemplate, TemplateStatus, UpdateTemplateInput } from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { templateRepository } from '../repositories'
import { notificationService } from '@/features/notifications/services/notification.service'

export const templateService = {
  async getTemplates(): Promise<AdminTemplate[]> {

    try {
      return await templateRepository.getTemplates()
    } catch (error) {
      console.error('Lỗi khi tải danh sách biểu mẫu mẫu:', error)
      throw new Error('Không thể tải danh sách biểu mẫu mẫu')
    }
  },

  async getTemplateById(id: number): Promise<AdminTemplate> {
    const template = await templateRepository.getTemplateById(id)
    if (!template) {
      throw new Error('Biểu mẫu mẫu không tồn tại.')
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
      throw new Error('Biểu mẫu mẫu không tồn tại.')
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Tên biểu mẫu không được để trống.')
    }

    if (data.review_status === TemplateStatus.REJECTED && (!data.rejectReason || !data.rejectReason.trim())) {
      throw new Error('Vui lòng nhập lý do từ chối duyệt biểu mẫu.')
    }

    try {
      const updated = await templateRepository.updateTemplate(id, data, adminUserId)
      if (!updated) {
        throw new Error('Không thể cập nhật biểu mẫu mẫu.')
      }

      await notificationService.notifyTemplateReview(existing, updated, data, adminUserId)
      return updated
    } catch (error) {
      console.error(`Lỗi khi cập nhật biểu mẫu mẫu id ${id}:`, error)
      throw error instanceof Error ? error : new Error('Không thể cập nhật biểu mẫu mẫu.')
    }
  },


  async getCategories(): Promise<Category[]> {
    try {
      return await templateRepository.getCategories()
    } catch (error) {
      console.error('Lỗi khi tải danh mục biểu mẫu:', error)
      throw new Error('Không thể tải danh sách danh mục biểu mẫu')
    }
  },
}
