import { AdminTemplate, Category, UpdateTemplateInput } from '../types/template.type'
import { templateRepository } from '../repositories'

export const templateService = {
  async getTemplates(): Promise<AdminTemplate[]> {
    return await templateRepository.getTemplates()
  },

  async getTemplateById(id: number): Promise<AdminTemplate | null> {
    return await templateRepository.getTemplateById(id)
  },

  async updateTemplate(id: number, data: UpdateTemplateInput): Promise<AdminTemplate | null> {
    return await templateRepository.updateTemplate(id, data)
  },

  async getCategories(): Promise<Category[]> {
    return await templateRepository.getCategories()
  },
}
