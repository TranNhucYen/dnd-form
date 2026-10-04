import { myFormRepository } from '../repositories'
import type {
  MyForm,
  CreateBlankFormInput,
  SaveSharingInput,
  ShareTokenResult,
  PublicFormDetail,
} from '../types/my-form.type'
import { ValidationError, NotFoundError } from '@/shared/errors'

function formatForm(form: MyForm): MyForm {
  const createdDate = new Date(form.createdAt)
  const updatedDate = new Date(form.updatedAt)

  let shareSummary = 'Riêng tư'
  if (form.isPublic) {
    shareSummary = 'Công khai (có liên kết)'
  } else if (form.sharedWith && form.sharedWith.length > 0) {
    shareSummary = `Chia sẻ với ${form.sharedWith.length} người`
  }

  return {
    ...form,
    formattedCreatedAt: createdDate.toLocaleDateString('vi-VN'),
    formattedUpdatedAt: updatedDate.toLocaleDateString('vi-VN'),
    shareSummary,
  }
}

export const myFormService = {
  /**
   * Lấy danh sách biểu mẫu của người dùng
   */
  async getMyForms(userId: number): Promise<MyForm[]> {
    const forms = await myFormRepository.getMyForms(userId)
    return forms.map(formatForm)
  },

  /**
   * Lấy thông tin chi tiết một biểu mẫu theo ID
   */
  async getMyFormById(userId: number, formId: number): Promise<MyForm> {
    const form = await myFormRepository.getMyFormById(formId, userId)
    if (!form) {
      throw new NotFoundError('Biểu mẫu không tồn tại hoặc bạn không có quyền truy cập.')
    }
    return formatForm(form)
  },

  /**
   * Tạo biểu mẫu trắng mới
   */
  async createBlankForm(
    userId: number,
    input: CreateBlankFormInput
  ): Promise<MyForm> {
    if (!input.name || !input.name.trim()) {
      throw new ValidationError('Tên biểu mẫu không được để trống.')
    }

    const created = await myFormRepository.createBlankForm(userId, {
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      sourceTemplateId: input.sourceTemplateId,
    })
    return formatForm(created)
  },

  /**
   * Nhân bản một biểu mẫu
   */
  async duplicateForm(
    userId: number,
    formId: number,
    customName?: string
  ): Promise<MyForm> {
    const duplicated = await myFormRepository.duplicateForm(
      formId,
      userId,
      customName
    )

    if (!duplicated) {
      throw new NotFoundError('Biểu mẫu không tồn tại hoặc bạn không có quyền sao chép.')
    }
    return formatForm(duplicated)
  },

  /**
   * Xóa một biểu mẫu
   */
  async deleteForm(userId: number, formId: number): Promise<boolean> {
    const deleted = await myFormRepository.deleteForm(formId, userId)
    if (!deleted) {
      throw new NotFoundError('Biểu mẫu không tồn tại hoặc bạn không có quyền xóa.')
    }
    return true
  },

  /**
   * Lấy token và trạng thái chia sẻ của biểu mẫu
   */
  async getFormShareToken(userId: number, formId: number): Promise<ShareTokenResult> {
    return await myFormRepository.getFormShareToken(formId, userId)
  },

  /**
   * Lưu cài đặt chia sẻ biểu mẫu (công khai link & mời người dùng)
   */
  async saveFormSharing(
    userId: number,
    formId: number,
    input: SaveSharingInput
  ): Promise<ShareTokenResult> {
    return await myFormRepository.saveFormSharing(formId, userId, input)
  },

  /**
   * Lấy chi tiết biểu mẫu công khai theo token
   */
  async getPublicFormByToken(token: string): Promise<PublicFormDetail | null> {
    return await myFormRepository.getPublicFormByToken(token)
  },
}
