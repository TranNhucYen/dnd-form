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

export const registerValidation = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Họ tên không được để trống')
      .max(255, 'Họ tên tối đa 255 ký tự'),
    email: z
      .string()
      .trim()
      .min(1, 'Email không được để trống')
      .pipe(z.email('Email không đúng định dạng')),
    password: z
      .string()
      .min(1, 'Mật khẩu không được để trống')
      .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z
      .string()
      .min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerValidation>
