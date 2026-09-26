'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import {
  ContributionItem,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
  ActionResponse,
} from '../types/community.type'
import { communityService } from '../services/community.service'

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

export async function getCommunityCategoriesAction(): Promise<ActionResponse<CommunityCategory[]>> {
  try {
    const data = await communityService.getCategories()
    return { success: true, data }
  } catch (error) {
    console.error('Lỗi khi tải danh mục cộng đồng:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải danh sách danh mục.',
    }
  }
}

export async function getUserFormsForContributeAction(): Promise<ActionResponse<UserFormOption[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await communityService.getUserFormsForContribute(authResult.userId)
    return { success: true, data }
  } catch (error) {
    console.error('Lỗi khi tải danh sách biểu mẫu của bạn:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải danh sách biểu mẫu của bạn.',
    }
  }
}

export async function getMyContributionsAction(): Promise<ActionResponse<ContributionItem[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await communityService.getMyContributions(authResult.userId)
    return { success: true, data }
  } catch (error) {
    console.error('Lỗi khi tải danh sách đóng góp:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải danh sách đóng góp của bạn.',
    }
  }
}

export async function submitContributionAction(
  input: ContributeFormInput
): Promise<ActionResponse<ContributionItem>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error }
    }

    const data = await communityService.submitContribution(authResult.userId, input)
    return { success: true, data }
  } catch (error) {
    console.error('Lỗi khi gửi đóng góp biểu mẫu:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể gửi biểu mẫu vào cộng đồng.',
    }
  }
}


