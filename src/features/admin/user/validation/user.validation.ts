import { z } from 'zod'
import { UserRole, UserStatus } from '@/shared/types/user.type'

export const createUserValidation = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Họ tên không được để trống'),
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .pipe(z.email('Email không đúng định dạng')),
  role: z.enum(UserRole, { message: 'Vai trò không hợp lệ' }),
  status: z.enum(UserStatus).default(UserStatus.ACTIVE),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .optional(),
})

export const updateUserStatusValidation = z.object({
  id: z
    .number({ message: 'Thông tin update không hợp lệ' })
    .int({ message: 'Thông tin update không hợp lệ' })
    .positive({ message: 'Thông tin update không hợp lệ' }),
  status: z.enum(UserStatus, { message: 'Thông tin update không hợp lệ' }),
})

export type CreateUserValidationInput = z.infer<typeof createUserValidation>
export type UpdateUserStatusValidationInput = z.infer<typeof updateUserStatusValidation>
