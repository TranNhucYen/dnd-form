import {
  ContributionItem,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
} from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'
import { communityRepository } from '../repositories'

export const communityService = {
  async getCategories(): Promise<CommunityCategory[]> {
    return await communityRepository.getCategories()
  },

  async getUserFormsForContribute(userId: number): Promise<UserFormOption[]> {
    return await communityRepository.getUserFormsForContribute(userId)
  },

  async getMyContributions(userId: number): Promise<ContributionItem[]> {
    const items = await communityRepository.getMyContributions(userId)
    return items.map((item) => ({
      ...item,
      statusLabel: CONTRIBUTION_STATUS_LABELS[item.status] || item.status,
    }))
  },

  async submitContribution(userId: number, input: ContributeFormInput): Promise<ContributionItem> {

    if (!input.title || !input.title.trim()) {
      throw new Error('Tên biểu mẫu không được để trống.')
    }
    if (!input.sourceFormId) {
      throw new Error('Vui lòng chọn biểu mẫu nguồn cần đóng góp.')
    }
    if (!input.categoryId) {
      throw new Error('Vui lòng chọn danh mục phù hợp cho biểu mẫu.')
    }

    const created = await communityRepository.submitContribution(userId, input)
    return {
      ...created,
      statusLabel: CONTRIBUTION_STATUS_LABELS[created.status] || created.status,
    }
  },
}

