export type { ActionResponse } from '@/shared/types/action.type'
import type { MyForm } from '@/features/my-form/types/my-form.type'
import type { Template } from '@/features/templates/types/template.type'

export interface HomeDashboardData {
  recentForms: MyForm[]
  featuredTemplates: Template[]
  totalFormsCount: number
}
