import { Template, UseTemplateResult } from "../types/template.type"
import { templateRepository } from "../repositories"
import { ValidationError, NotFoundError, UnauthorizedError } from "@/shared/errors"

export const templateService = {
  async getTemplates(): Promise<Template[]> {
    return await templateRepository.getTemplates()
  },

  async getTemplateById(id: number): Promise<Template> {
    if (!id || isNaN(id)) {
      throw new ValidationError("Mã biểu mẫu không hợp lệ.")
    }

    const template = await templateRepository.getTemplateById(id)
    if (!template) {
      throw new NotFoundError("Biểu mẫu mẫu không tồn tại hoặc chưa được kích hoạt.")
    }

    return template
  },

  async useTemplate(templateId: number, userId: number): Promise<UseTemplateResult> {
    if (!templateId || isNaN(templateId)) {
      throw new ValidationError("Mã biểu mẫu không hợp lệ.")
    }
    if (!userId || isNaN(userId)) {
      throw new UnauthorizedError("Người dùng không hợp lệ.")
    }

    return await templateRepository.useTemplate(templateId, userId)
  },
}
