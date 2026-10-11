import { myFormService } from '@/features/my-form/services/my-form.service'
import { templateService } from '@/features/templates/services/template.service'
import type { HomeDashboardData } from '../types/home.type'

export const homeService = {
  async getHomeDashboardData(userId: number): Promise<HomeDashboardData> {
    const [allForms, templatesRes] = await Promise.all([
      myFormService.getMyForms(userId),
      templateService.getTemplates({ pageSize: 4 }),
    ])

    return {
      recentForms: allForms.slice(0, 4),
      featuredTemplates: templatesRes.items,
      totalFormsCount: allForms.length,
    }
  },
}
