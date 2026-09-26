import { Template, UseTemplateResult } from "../types/template.type"
import { templateRepository } from "../repositories"

export const templateService = {
  async getTemplates(): Promise<Template[]> {
    try {
      return await templateRepository.getTemplates()
    } catch (error) {
      console.error("Lỗi khi tải danh sách biểu mẫu mẫu:", error)
      throw new Error("Không thể tải danh sách biểu mẫu mẫu.")
    }
  },

  async getTemplateById(id: number): Promise<Template> {
    if (!id || isNaN(id)) {
      throw new Error("Mã biểu mẫu không hợp lệ.")
    }

    let template: Template | null = null
    try {
      template = await templateRepository.getTemplateById(id)
    } catch (error) {
      console.error(`Lỗi khi tải biểu mẫu id ${id}:`, error)
      throw new Error("Không thể tải thông tin biểu mẫu mẫu.")
    }

    if (!template) {
      throw new Error("Biểu mẫu mẫu không tồn tại hoặc chưa được kích hoạt.")
    }

    return template
  },

  async useTemplate(templateId: number, userId: number): Promise<UseTemplateResult> {
    if (!templateId || isNaN(templateId)) {
      throw new Error("Mã biểu mẫu không hợp lệ.")
    }
    if (!userId || isNaN(userId)) {
      throw new Error("Người dùng không hợp lệ.")
    }

    try {
      return await templateRepository.useTemplate(templateId, userId)
    } catch (error) {
      console.error(`Lỗi khi tạo bản sao biểu mẫu id ${templateId}:`, error)
      throw error instanceof Error ? error : new Error("Không thể tạo bản sao biểu mẫu mẫu.")
    }
  },
}
