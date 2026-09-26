'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { Template, ActionResponse, UseTemplateResult } from '../types/template.type'
import { templateService } from '../services/template.service'

async function getAuthenticatedUserId(): Promise<{ userId: number } | { error: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.' }
  }

  const user = await verifyJwtToken(token)
  if (!user) {
    return {
      error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    }
  }

  return { userId: user.id }
}

export async function getTemplatesAction(): Promise<ActionResponse<Template[]>> {
  try {
    const templates = await templateService.getTemplates()
    return { success: true, data: templates }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải danh sách biểu mẫu mẫu',
    }
  }
}

export async function getTemplateByIdAction(id: number): Promise<ActionResponse<Template>> {
  try {
    const template = await templateService.getTemplateById(id)
    return { success: true, data: template }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải thông tin biểu mẫu mẫu',
    }
  }
}

export async function useTemplateAction(
  templateId: number
): Promise<ActionResponse<UseTemplateResult>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const result = await templateService.useTemplate(templateId, authResult.userId)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo bản sao biểu mẫu',
    }
  }
}
