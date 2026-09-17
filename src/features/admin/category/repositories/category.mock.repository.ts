import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'
import { ICategoryRepository } from './category.repository'
import { slugify } from '../utils/slugify'

export let mockCategories: Category[] = [
  { id: 1, name: 'Khảo sát', slug: 'khao-sat', createdAt: '01/01/2026' },
  { id: 2, name: 'Đăng ký', slug: 'dang-ky', createdAt: '01/01/2026' },
  { id: 3, name: 'Đơn từ', slug: 'don-tu', createdAt: '01/01/2026' },
  { id: 4, name: 'Đánh giá', slug: 'danh-gia', createdAt: '01/01/2026' },
  { id: 5, name: 'Liên hệ', slug: 'lien-he', createdAt: '01/01/2026' },
  { id: 6, name: 'Sự kiện', slug: 'su-kien', createdAt: '01/01/2026' },
]

export const categoryMockRepository: ICategoryRepository = {
  async getCategories(): Promise<Category[]> {
    return [...mockCategories]
  },

  async getCategoryById(id: number): Promise<Category | null> {
    const found = mockCategories.find((c) => c.id === id)
    return found ? { ...found } : null
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const newId =
      mockCategories.length > 0
        ? Math.max(...mockCategories.map((c) => c.id)) + 1
        : 1
    const today = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const newCategory: Category = {
      id: newId,
      name: data.name.trim(),
      slug: data.slug?.trim() || slugify(data.name),
      createdAt: today,
    }

    mockCategories.unshift(newCategory)
    return { ...newCategory }
  },

  async updateCategory(id: number, data: UpdateCategoryInput): Promise<Category | null> {
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) return null

    const current = mockCategories[index]
    const updatedName = data.name !== undefined ? data.name.trim() : current.name
    const updatedSlug =
      data.slug !== undefined
        ? data.slug.trim()
        : data.name !== undefined
        ? slugify(data.name)
        : current.slug

    mockCategories[index] = {
      ...current,
      name: updatedName,
      slug: updatedSlug,
    }

    return { ...mockCategories[index] }
  },

  async deleteCategory(id: number): Promise<boolean> {
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) return false
    mockCategories.splice(index, 1)
    return true
  },
}
