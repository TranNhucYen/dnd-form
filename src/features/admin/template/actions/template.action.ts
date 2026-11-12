'use server'

import { handleActionError } from '@/shared/utils/action.util'
import { requirePermission } from '@/shared/auth/authorization'
import { PERMISSIONS } from '@/shared/auth/permissions'
import {
  AdminTemplate,
  UpdateTemplateInput,
  ActionResponse,
  TemplatePaginationParams,
  TemplatePaginatedResult,
} from '../types/template.type'
import { templateService } from '../services/template.service'

export async function getTemplatesAction(
  params?: TemplatePaginationParams,
): Promise<ActionResponse<TemplatePaginatedResult>> {
  try {
    await requirePermission(PERMISSIONS.template.read)
    const data = await templateService.getTemplates(params)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'admin:getTemplatesAction')
  }
}

export async function updateTemplateAction(
  id: number,
  data: UpdateTemplateInput,
): Promise<ActionResponse<AdminTemplate>> {
  try {
    const { userId } = await requirePermission(PERMISSIONS.template.update)
    const updated = await templateService.updateTemplate(id, data, userId)
    return { success: true, data: updated }
  } catch (error) {
    return handleActionError(error, 'admin:updateTemplateAction')
  }
}
