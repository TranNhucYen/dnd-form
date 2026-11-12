'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import {
  Template,
  ActionResponse,
  UseTemplateResult,
  GetTemplatesParams,
  PaginatedTemplates,
} from '../types/template.type'
import { templateService } from '../services/template.service'
import { sanitizeSignatureFromSchema } from '../utils/sanitize'

async function getAuthenticatedUserId(): Promise<
  { userId: number } | { error: string; code: string }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.', code: 'UNAUTHORIZED' }
  }

  const user = await verifyJwtToken(token)
  if (!user) {
    return {
      error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      code: 'UNAUTHORIZED',
    }
  }

  if (user.status === 'blocked') {
    cookieStore.delete('auth_token')
    return { error: 'Tài khoản của bạn đã bị khóa.', code: 'ACCOUNT_BLOCKED' }
  }

  return { userId: user.id }
}

export async function getTemplatesAction(
  params?: GetTemplatesParams
): Promise<ActionResponse<PaginatedTemplates>> {
  try {
    const templates = await templateService.getTemplates(params)
    return { success: true, data: templates }
  } catch (error) {
    return handleActionError(error, 'getTemplatesAction')
  }
}

export async function getTemplateCategoriesAction(): Promise<ActionResponse<string[]>> {
  try {
    const categories = await templateService.getCategories()
    return { success: true, data: categories }
  } catch (error) {
    return handleActionError(error, 'getTemplateCategoriesAction')
  }
}

export async function getTemplateByIdAction(id: number): Promise<ActionResponse<Template>> {
  try {
    const template = await templateService.getTemplateById(id)
    return { success: true, data: template }
  } catch (error) {
    return handleActionError(error, 'getTemplateByIdAction')
  }
}

// Public endpoints return only fields required by the template gallery. Keep this
// allowlist separate from the authenticated dashboard actions.
export async function getPublicTemplatesAction(
  params?: GetTemplatesParams
): Promise<ActionResponse<PaginatedTemplates>> {
  try {
    const safeParams: GetTemplatesParams = {
      page: Number.isSafeInteger(params?.page) ? Math.min(Math.max(params!.page!, 1), 100_000) : 1,
      pageSize: Number.isSafeInteger(params?.pageSize)
        ? Math.min(Math.max(params!.pageSize!, 1), 50)
        : 25,
      search: typeof params?.search === 'string' ? params.search.trim().slice(0, 100) : undefined,
      categoryName:
        typeof params?.categoryName === 'string' ? params.categoryName.slice(0, 100) : undefined,
    }
    const result = await templateService.getTemplates(safeParams)
    return {
      success: true,
      data: {
        ...result,
        items: result.items.map((template) => ({
          id: template.id,
          name: template.name,
          ownerName: template.ownerName,
          categoryName: template.categoryName,
          pricingType: template.pricingType,
          description: template.description,
          downloads: template.downloads,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
        })),
      },
    }
  } catch (error) {
    return handleActionError(error, 'getPublicTemplatesAction')
  }
}

export async function getPublicTemplateCategoriesAction(): Promise<ActionResponse<string[]>> {
  try {
    return { success: true, data: await templateService.getPublicCategories() }
  } catch (error) {
    return handleActionError(error, 'getPublicTemplateCategoriesAction')
  }
}

export async function getPublicTemplateByIdAction(id: number): Promise<ActionResponse<Template>> {
  try {
    const template = await templateService.getTemplateById(id)
    const schemaContent = sanitizeSignatureFromSchema(template.schemaContent)
    return {
      success: true,
      data: {
        id: template.id,
        name: template.name,
        ownerName: template.ownerName,
        categoryName: template.categoryName,
        pricingType: template.pricingType,
        description: template.description,
        guideline: template.guideline,
        downloads: template.downloads,
        schemaContent: schemaContent ?? undefined,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
    }
  } catch (error) {
    return handleActionError(error, 'getPublicTemplateByIdAction')
  }
}

export async function useTemplateAction(
  templateId: number
): Promise<ActionResponse<UseTemplateResult>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const result = await templateService.useTemplate(templateId, authResult.userId)
    return { success: true, data: result }
  } catch (error) {
    return handleActionError(error, 'useTemplateAction')
  }
}
