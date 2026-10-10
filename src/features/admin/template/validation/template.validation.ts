import { z } from 'zod'
import { TemplateReviewStatus } from '@/shared/types/template.type'

export const templatePaginationValidation = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(8),
  search: z.string().trim().optional(),
  status: z
    .enum(['all', TemplateReviewStatus.PENDING, TemplateReviewStatus.APPROVED, TemplateReviewStatus.REJECTED])
    .default('all'),
})

export const updateTemplateValidation = z.object({
  title: z.string().trim().min(1, 'Tên biểu mẫu không được để trống.').optional(),
  description: z.string().trim().optional().nullable(),
  categoryId: z.number().int().positive().optional(),
  review_status: z
    .enum([TemplateReviewStatus.PENDING, TemplateReviewStatus.APPROVED, TemplateReviewStatus.REJECTED])
    .optional(),
  rejectReason: z.string().trim().optional(),
})

export type TemplatePaginationValidationInput = z.infer<typeof templatePaginationValidation>
export type UpdateTemplateValidationInput = z.infer<typeof updateTemplateValidation>
