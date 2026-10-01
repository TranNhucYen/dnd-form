import type { IMyFormRepository } from './my-form.repository'
import type {
  MyForm,
  CreateBlankFormInput,
  SaveSharingInput,
  ShareTokenResult,
  PublicFormDetail,
} from '../types/my-form.type'

const mockForms: MyForm[] = [
  {
    id: 1,
    name: 'Phiếu khảo sát mức độ hài lòng khách hàng Q3/2026',
    description: 'Thu thập ý kiến đóng góp của khách hàng về chất lượng dịch vụ.',
    fieldsCount: 8,
    isPublic: true,
    createdAt: new Date('2026-07-10').toISOString(),
    updatedAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 2,
    name: 'Đơn xin nghỉ phép - Phòng Kỹ thuật',
    description: 'Biểu mẫu nội bộ dùng để đăng ký ngày nghỉ phép.',
    fieldsCount: 5,
    isPublic: false,
    sourceTemplateId: 1,
    sourceTemplateName: 'Đơn xin nghỉ phép',
    createdAt: new Date('2026-07-15').toISOString(),
    updatedAt: new Date('2026-08-10').toISOString(),
  },
  {
    id: 3,
    name: 'Hợp đồng lao động thử việc 2 tháng',
    description: 'Mẫu hợp đồng thử việc theo quy định mới.',
    fieldsCount: 12,
    isPublic: false,
    sourceTemplateId: 4,
    sourceTemplateName: 'Hợp đồng lao động không xác định thời hạn',
    createdAt: new Date('2026-08-01').toISOString(),
    updatedAt: new Date('2026-08-18').toISOString(),
  },
]

let formsState: MyForm[] = [...mockForms]

export const myFormMockRepository: IMyFormRepository = {
  async getMyForms(): Promise<MyForm[]> {
    return [...formsState]
  },

  async getMyFormById(formId: number): Promise<MyForm | null> {
    const found = formsState.find((f) => f.id === formId)
    return found ? { ...found } : null
  },

  async createBlankForm(
    _userId: number,
    input: CreateBlankFormInput
  ): Promise<MyForm> {
    void _userId
    const newForm: MyForm = {
      id: Date.now(),
      name: input.name,
      description: input.description,
      fieldsCount: 0,
      isPublic: false,
      sourceTemplateId: input.sourceTemplateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    formsState.unshift(newForm)
    return { ...newForm }
  },

  async duplicateForm(
    formId: number,
    _userId: number,
    customName?: string
  ): Promise<MyForm | null> {
    void _userId
    const origin = formsState.find((f) => f.id === formId)
    if (!origin) return null

    const cloned: MyForm = {
      ...origin,
      id: Date.now(),
      name: customName || `${origin.name} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    formsState.unshift(cloned)
    return { ...cloned }
  },

  async deleteForm(formId: number): Promise<boolean> {
    const beforeLen = formsState.length
    formsState = formsState.filter((f) => f.id !== formId)
    return formsState.length < beforeLen
  },

  async getFormShareToken(formId: number, _userId: number): Promise<ShareTokenResult> {
    void _userId
    const found = formsState.find((f) => f.id === formId)
    const isPublic = !!found?.isPublic
    const token = isPublic ? `mock-token-${formId}` : null
    return {
      isPublic,
      token,
      shareUrl: token ? `/share/${token}` : null,
      sharedWith: found?.sharedWith || [],
    }
  },

  async saveFormSharing(
    formId: number,
    _userId: number,
    input: SaveSharingInput
  ): Promise<ShareTokenResult> {
    void _userId
    const found = formsState.find((f) => f.id === formId)
    if (found) {
      found.isPublic = input.isPublic
      if (input.sharedUsers !== undefined) {
        found.sharedWith = input.sharedUsers.map((u, i) => ({
          id: `u_${i}`,
          email: u.email,
          role: u.role,
          addedAt: new Date().toISOString(),
        }))
      }
    }
    const token = input.isPublic ? `mock-token-${formId}` : null
    return {
      isPublic: input.isPublic,
      token,
      shareUrl: token ? `/share/${token}` : null,
      sharedWith: found?.sharedWith || [],
    }
  },

  async getPublicFormByToken(token: string): Promise<PublicFormDetail | null> {
    const formId = Number(token.replace('mock-token-', ''))
    const found = formsState.find((f) => f.id === formId && f.isPublic)
    if (!found) return null
    return {
      id: found.id,
      name: found.name,
      description: found.description ?? null,
      schemaContent: { fields: [] },
    }
  },
}
