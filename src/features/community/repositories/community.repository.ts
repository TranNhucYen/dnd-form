import { CommunityTemplate, ContributionItem, ContributeFormInput } from '../types/community.type'

export interface ICommunityRepository {
  getCommunityTemplates(): Promise<CommunityTemplate[]>
  getTemplateById(id: number): Promise<CommunityTemplate | null>
  getMyContributions(): Promise<ContributionItem[]>
  submitContribution(input: ContributeFormInput): Promise<ContributionItem>
  useCommunityTemplate(id: number): Promise<{ newFormId: number; title: string }>
}
