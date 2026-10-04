import { myFormService } from '@/features/my-form/services/my-form.service'
import { templateService } from '@/features/templates/services/template.service'
import type { HomeDashboardData } from '../types/home.type'

export const homeService = {
  async getHomeDashboardData(userId: number): Promise<HomeDashboardData> {
    const [allForms, allTemplates] = await Promise.all([
      myFormService.getMyForms(userId),
      templateService.getTemplates(),
    ])

    return {
      recentForms: allForms.slice(0, 4),
      featuredTemplates: allTemplates.slice(0, 4),
      totalFormsCount: allForms.length,
    }
  },
}
