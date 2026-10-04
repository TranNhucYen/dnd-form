'use server'

import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { handleActionError } from '@/shared/utils/action.util'
import { AccountBlockedError } from '@/shared/errors'
import {
  ContributionItem,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
  ActionResponse,
} from '../types/community.type'
import { communityService } from '../services/community.service'

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

export async function getCommunityCategoriesAction(): Promise<ActionResponse<CommunityCategory[]>> {
  try {
    const data = await communityService.getCategories()
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getCommunityCategoriesAction')
  }
}

export async function getUserFormsForContributeAction(): Promise<ActionResponse<UserFormOption[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await communityService.getUserFormsForContribute(authResult.userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getUserFormsForContributeAction')
  }
}

export async function getMyContributionsAction(): Promise<ActionResponse<ContributionItem[]>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await communityService.getMyContributions(authResult.userId)
    return { success: true, data }
  } catch (error) {
    return handleActionError(error, 'getMyContributionsAction')
  }
}

export async function submitContributionAction(
  input: ContributeFormInput
): Promise<ActionResponse<ContributionItem>> {
  try {
    const authResult = await getAuthenticatedUserId()
    if ('error' in authResult) {
      return { success: false, error: authResult.error, code: authResult.code }
    }

    const data = await communityService.submitContribution(authResult.userId, input)
    return { success: true, data }
  } catch (error) {
    if (error instanceof AccountBlockedError) {
      const cookieStore = await cookies()
      cookieStore.delete('auth_token')
    }
    return handleActionError(error, 'submitContributionAction')
  }
}
