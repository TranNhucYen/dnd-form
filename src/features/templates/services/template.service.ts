import { Template } from "../types/template.type"
import { templateRepository } from "../repositories"

export const templateService = {
  async getTemplates(): Promise<Template[]> {
    return await templateRepository.findAll()
  },

  async getTemplateById(id: number): Promise<Template | null> {
    return await templateRepository.findById(id)
  },
}
