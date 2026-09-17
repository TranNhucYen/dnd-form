import { AdminTemplate, Category, UpdateTemplateInput } from '../types/template.type'

export interface ITemplateRepository {
  getTemplates(): Promise<AdminTemplate[]>
  getTemplateById(id: number): Promise<AdminTemplate | null>
  updateTemplate(id: number, data: UpdateTemplateInput): Promise<AdminTemplate | null>
  getCategories(): Promise<Category[]>
}
