'use server'

import {
  CommunityTemplate,
  ContributionItem,
  ContributeFormInput,
} from '../types/community.type'
import { communityService } from '../services/community.service'

export async function getCommunityTemplatesAction(): Promise<CommunityTemplate[]> {
  try {
    return await communityService.getCommunityTemplates()
  } catch (error) {
    console.error('Lỗi khi tải kho biểu mẫu cộng đồng:', error)
    throw new Error('Không thể tải danh sách biểu mẫu cộng đồng')
  }
}

export async function getCommunityTemplateByIdAction(
  id: number
): Promise<CommunityTemplate | null> {
  try {
    return await communityService.getTemplateById(id)
  } catch (error) {
    console.error(`Lỗi khi tải template cộng đồng ${id}:`, error)
    throw new Error('Không thể tải chi tiết biểu mẫu cộng đồng')
  }
}

export async function getMyContributionsAction(): Promise<ContributionItem[]> {
  try {
    return await communityService.getMyContributions()
  } catch (error) {
    console.error('Lỗi khi tải danh sách đóng góp:', error)
    throw new Error('Không thể tải danh sách đóng góp của bạn')
  }
}

export async function submitContributionAction(
  input: ContributeFormInput
): Promise<ContributionItem> {
  try {
    return await communityService.submitContribution(input)
  } catch (error) {
    console.error('Lỗi khi gửi đóng góp biểu mẫu:', error)
    throw new Error('Không thể gửi biểu mẫu vào cộng đồng')
  }
}

export async function useCommunityTemplateAction(
  id: number
): Promise<{ newFormId: number; title: string }> {
  try {
    return await communityService.useCommunityTemplate(id)
  } catch (error) {
    console.error(`Lỗi khi sử dụng template ${id}:`, error)
    throw new Error('Không thể sao chép biểu mẫu cộng đồng')
  }
}
