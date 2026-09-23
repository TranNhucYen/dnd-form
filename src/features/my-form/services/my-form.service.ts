import {
  MyForm,
  FormStatus,
  SharedUser,
  CreateFormInput,
  UpdateFormInput,
} from '../types/my-form.type'
import { FORM_STATUS_LABELS } from '../constants/my-form.constant'
import { myFormRepository } from '../repositories'

function mapToForm(form: any): MyForm {
  const createdDate = new Date(form.createdAt)
  const updatedDate = new Date(form.updatedAt)

  let shareSummary = 'Riêng tư'
  if (form.isPublic) {
    shareSummary = 'Công khai (có link)'
  } else if (form.sharedWith && form.sharedWith.length > 0) {
    shareSummary = `Chia sẻ (${form.sharedWith.length} người)`
  }

  return {
    ...form,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    formattedCreatedAt: createdDate.toLocaleDateString('vi-VN'),
    formattedUpdatedAt: updatedDate.toLocaleDateString('vi-VN'),
    statusLabel: FORM_STATUS_LABELS[form.status as FormStatus] || form.status,
    shareSummary,
  }
}

export const myFormService = {
  async getMyForms(): Promise<MyForm[]> {
    const forms = await myFormRepository.findAll()
    return forms.map(mapToForm)
  },

  async getMyFormById(id: number): Promise<MyForm | null> {
    const form = await myFormRepository.findById(id)
    if (!form) return null
    return mapToForm(form)
  },

  async createForm(input: CreateFormInput): Promise<MyForm> {
    const created = await myFormRepository.create({
      title: input.title,
      description: input.description,
      status: FormStatus.DRAFT,
      sourceTemplateId: input.sourceTemplateId,
      sourceTemplateName: input.sourceTemplateName,
    })
    return mapToForm(created)
  },

  async updateForm(id: number, input: UpdateFormInput): Promise<MyForm | null> {
    const updated = await myFormRepository.update(id, input)
    if (!updated) return null
    return mapToForm(updated)
  },

  async deleteForm(id: number): Promise<boolean> {
    return await myFormRepository.delete(id)
  },

  async duplicateForm(
    id: number,
    customData?: { title?: string; description?: string }
  ): Promise<MyForm | null> {
    const duplicated = await myFormRepository.duplicate(id, customData)
    if (!duplicated) return null
    return mapToForm(duplicated)
  },

  async updateFormStatus(id: number, status: FormStatus): Promise<MyForm | null> {
    const updated = await myFormRepository.updateStatus(id, status)
    if (!updated) return null
    return mapToForm(updated)
  },

  async updateFormSharing(
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ): Promise<MyForm | null> {
    const updated = await myFormRepository.updateSharing(id, sharing)
    if (!updated) return null
    return mapToForm(updated)
  },
}
