import {
  CommunityTemplate,
  ContributionItem,
  ContributeFormInput,
} from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'
import { communityRepository } from '../repositories'

export const communityService = {
  async getCommunityTemplates(): Promise<CommunityTemplate[]> {
    return await communityRepository.getCommunityTemplates()
  },

  async getTemplateById(id: number): Promise<CommunityTemplate | null> {
    return await communityRepository.getTemplateById(id)
  },

  async getMyContributions(): Promise<ContributionItem[]> {
    const items = await communityRepository.getMyContributions()
    return items.map((item) => ({
      ...item,
      statusLabel: CONTRIBUTION_STATUS_LABELS[item.status] || item.status,
    }))
  },

  async submitContribution(input: ContributeFormInput): Promise<ContributionItem> {
    const created = await communityRepository.submitContribution(input)
    return {
      ...created,
      statusLabel: CONTRIBUTION_STATUS_LABELS[created.status] || created.status,
    }
  },

  async useCommunityTemplate(id: number): Promise<{ newFormId: number; title: string }> {
    return await communityRepository.useCommunityTemplate(id)
  },
}
