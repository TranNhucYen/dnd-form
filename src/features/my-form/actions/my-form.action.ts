'use server'

import {
  MyForm,
  CreateFormInput,
  UpdateFormInput,
  FormStatus,
  SharedUser,
} from '../types/my-form.type'
import { myFormService } from '../services/my-form.service'

export async function getMyFormsAction(): Promise<MyForm[]> {
  try {
    return await myFormService.getMyForms()
  } catch (error) {
    console.error('Lỗi khi tải danh sách biểu mẫu:', error)
    throw new Error('Không thể tải danh sách biểu mẫu của bạn')
  }
}

export async function getMyFormByIdAction(id: number): Promise<MyForm | null> {
  try {
    return await myFormService.getMyFormById(id)
  } catch (error) {
    console.error(`Lỗi khi tải biểu mẫu id ${id}:`, error)
    throw new Error('Không thể tải thông tin biểu mẫu')
  }
}

export async function createFormAction(input: CreateFormInput): Promise<MyForm> {
  try {
    return await myFormService.createForm(input)
  } catch (error) {
    console.error('Lỗi khi tạo biểu mẫu mới:', error)
    throw new Error('Không thể tạo biểu mẫu mới')
  }
}

export async function updateFormAction(
  id: number,
  input: UpdateFormInput
): Promise<MyForm | null> {
  try {
    return await myFormService.updateForm(id, input)
  } catch (error) {
    console.error(`Lỗi khi cập nhật biểu mẫu ${id}:`, error)
    throw new Error('Không thể cập nhật biểu mẫu')
  }
}

export async function deleteFormAction(id: number): Promise<boolean> {
  try {
    return await myFormService.deleteForm(id)
  } catch (error) {
    console.error(`Lỗi khi xóa biểu mẫu ${id}:`, error)
    throw new Error('Không thể xóa biểu mẫu')
  }
}

export async function duplicateFormAction(
  id: number,
  customData?: { title?: string; description?: string }
): Promise<MyForm | null> {
  try {
    return await myFormService.duplicateForm(id, customData)
  } catch (error) {
    console.error(`Lỗi khi sao chép biểu mẫu ${id}:`, error)
    throw new Error('Không thể sao chép biểu mẫu')
  }
}

export async function updateFormStatusAction(
  id: number,
  status: FormStatus
): Promise<MyForm | null> {
  try {
    return await myFormService.updateFormStatus(id, status)
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái biểu mẫu ${id}:`, error)
    throw new Error('Không thể cập nhật trạng thái biểu mẫu')
  }
}

export async function updateFormSharingAction(
  id: number,
  sharing: { isPublic: boolean; sharedWith: SharedUser[] }
): Promise<MyForm | null> {
  try {
    return await myFormService.updateFormSharing(id, sharing)
  } catch (error) {
    console.error(`Lỗi khi cập nhật chia sẻ biểu mẫu ${id}:`, error)
    throw new Error('Không thể cập nhật cài đặt chia sẻ')
  }
}
