import { z } from 'zod'

export const loginValidation = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .pipe(z.email('Email không đúng định dạng')),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export type LoginInput = z.infer<typeof loginValidation>
