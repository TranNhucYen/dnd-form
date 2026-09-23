'use server'

import { Template } from "../types/template.type"
import { templateService } from "../services/template.service"

export async function getTemplatesAction(): Promise<Template[]> {
  try {
    const templates = await templateService.getTemplates()
    return templates
  } catch (error) {
    console.error("Lỗi khi tải danh sách biểu mẫu:", error)
    throw new Error("Không thể tải danh sách biểu mẫu")
  }
}

export async function getTemplateByIdAction(id: number): Promise<Template | null> {
  try {
    const template = await templateService.getTemplateById(id)
    return template
  } catch (error) {
    console.error(`Lỗi khi tải biểu mẫu id ${id}:`, error)
    throw new Error("Không thể tải thông tin biểu mẫu")
  }
}

