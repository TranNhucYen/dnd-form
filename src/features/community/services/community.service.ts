import {
  ContributionItem,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
} from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'
import { communityRepository } from '../repositories'
import { sanitizeSignatureFromSchema, filterTemplateMedia } from '@/features/templates/utils/sanitize'

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

    // Lấy dữ liệu biểu mẫu nguồn từ repository
    const sourceFormData = await communityRepository.getSourceFormData(userId, input.sourceFormId)
    if (!sourceFormData) {
      throw new Error('Biểu mẫu nguồn không tồn tại hoặc bạn không có quyền sở hữu.')
    }

    // Xóa chữ ký cá nhân khỏi schema và danh sách media
    const sanitizedSchema = sanitizeSignatureFromSchema(sourceFormData.schemaContent)
    if (!sanitizedSchema) {
      throw new Error('Không tìm thấy dữ liệu cấu trúc của biểu mẫu nguồn.')
    }
    const sanitizedMedia = filterTemplateMedia(sourceFormData.mediaList)

    // Lưu biểu mẫu mẫu vào cơ sở dữ liệu
    const created = await communityRepository.createContributionTemplate({
      userId,
      input,
      schemaContent: sanitizedSchema,
      mediaList: sanitizedMedia,
    })

    return {
      ...created,
      statusLabel: CONTRIBUTION_STATUS_LABELS[created.status] || created.status,
    }
  },
}

