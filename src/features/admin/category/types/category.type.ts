export interface Category {
  id: number
  name: string
  slug: string
  createdAt?: string
}

export interface CreateCategoryInput {
  name: string
  slug?: string
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
}
