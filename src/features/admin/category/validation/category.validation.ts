import { z } from 'zod'

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Tên loại biểu mẫu không được để trống')
  .regex(/^\p{L}/u, 'Tên loại biểu mẫu không được bắt đầu bằng số hoặc ký tự đặc biệt')
  .regex(/\p{L}$/u, 'Tên loại biểu mẫu không được kết thúc bằng số hoặc ký tự đặc biệt')

export const createCategoryValidation = z.object({
  name: categoryNameSchema,
  slug: z
    .string()
    .trim()
    .optional(),
})

export const updateCategoryValidation = z.object({
  name: categoryNameSchema.optional(),
  slug: z
    .string()
    .trim()
    .optional(),
})

export type CreateCategoryValidationInput = z.infer<typeof createCategoryValidation>
export type UpdateCategoryValidationInput = z.infer<typeof updateCategoryValidation>

