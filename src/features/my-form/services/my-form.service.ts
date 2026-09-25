import { myFormRepository } from '../repositories'
import type { MyForm, CreateBlankFormInput } from '../types/my-form.type'

function formatForm(form: MyForm): MyForm {
  const createdDate = new Date(form.createdAt)
  const updatedDate = new Date(form.updatedAt)

  const shareSummary = form.isPublic ? 'Công khai (có liên kết)' : 'Riêng tư'

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
    try {
      const forms = await myFormRepository.getMyForms(userId)
      return forms.map(formatForm)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách biểu mẫu của tôi:', error)
      throw new Error('Không thể tải danh sách biểu mẫu của bạn. Vui lòng thử lại sau.')
    }
  },

  /**
   * Lấy thông tin chi tiết một biểu mẫu theo ID
   */
  async getMyFormById(userId: number, formId: number): Promise<MyForm> {
    let form: MyForm | null = null
    try {
      form = await myFormRepository.getMyFormById(formId, userId)
    } catch (error) {
      console.error(`Lỗi khi lấy biểu mẫu id ${formId}:`, error)
      throw new Error('Không thể tải thông tin biểu mẫu.')
    }

    if (!form) {
      throw new Error('Biểu mẫu không tồn tại hoặc bạn không có quyền truy cập.')
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
      throw new Error('Tên biểu mẫu không được để trống.')
    }

    try {
      const created = await myFormRepository.createBlankForm(userId, {
        name: input.name.trim(),
        description: input.description?.trim() || undefined,
        sourceTemplateId: input.sourceTemplateId,
      })
      return formatForm(created)
    } catch (error) {
      console.error('Lỗi khi tạo biểu mẫu mới:', error)
      throw new Error('Không thể tạo biểu mẫu mới. Vui lòng thử lại sau.')
    }
  },

  /**
   * Nhân bản một biểu mẫu
   */
  async duplicateForm(
    userId: number,
    formId: number,
    customName?: string
  ): Promise<MyForm> {
    let duplicated: MyForm | null = null
    try {
      duplicated = await myFormRepository.duplicateForm(
        formId,
        userId,
        customName
      )
    } catch (error) {
      console.error(`Lỗi khi sao chép biểu mẫu id ${formId}:`, error)
      throw new Error('Không thể sao chép biểu mẫu. Vui lòng thử lại sau.')
    }

    if (!duplicated) {
      throw new Error('Biểu mẫu không tồn tại hoặc bạn không có quyền sao chép.')
    }
    return formatForm(duplicated)
  },

  /**
   * Xóa một biểu mẫu
   */
  async deleteForm(userId: number, formId: number): Promise<boolean> {
    let deleted = false
    try {
      deleted = await myFormRepository.deleteForm(formId, userId)
    } catch (error) {
      console.error(`Lỗi khi xóa biểu mẫu id ${formId}:`, error)
      throw new Error('Không thể xóa biểu mẫu. Vui lòng thử lại sau.')
    }

    if (!deleted) {
      throw new Error('Biểu mẫu không tồn tại hoặc bạn không có quyền xóa.')
    }
    return true
  },
}
