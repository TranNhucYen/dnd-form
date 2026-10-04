export type { Category } from '@/shared/types/category.type'
export type { ActionResponse } from '@/shared/types/action.type'

export interface CreateCategoryInput {
  name: string
  slug?: string
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
}
