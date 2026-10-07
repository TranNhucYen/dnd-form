import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'
import { categoryRepository } from '../repositories'
import { slugify } from '../utils/slugify'
import {
  createCategoryValidation,
  updateCategoryValidation,
} from '../validation/category.validation'
import { ValidationError, NotFoundError, ConflictError, InternalError } from '@/shared/errors'

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return await categoryRepository.getCategories()
  },

  async getCategoryById(id: number): Promise<Category | null> {
    const category = await categoryRepository.getCategoryById(id)
    if (!category) {
      throw new NotFoundError('Loại biểu mẫu không tồn tại')
    }
    return category
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const parsed = createCategoryValidation.safeParse(data)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message)
    }

    const name = parsed.data.name
    const slug = parsed.data.slug?.trim() || slugify(name)

    const existingCategory = await categoryRepository.getCategoryBySlug(slug)
    if (existingCategory) {
      throw new ConflictError('Đường dẫn loại biểu mẫu đã tồn tại')
    }

    const created = await categoryRepository.createCategory({ name, slug })
    if (!created) {
      throw new InternalError('Tạo loại biểu mẫu thất bại')
    }

    return created
  },

  async updateCategory(id: number, data: UpdateCategoryInput): Promise<Category | null> {
    const parsed = updateCategoryValidation.safeParse(data)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message)
    }

    const existingCategory = await categoryRepository.getCategoryById(id)
    if (!existingCategory) {
      throw new NotFoundError('Loại biểu mẫu không tồn tại')
    }

    const name = parsed.data.name !== undefined ? parsed.data.name : existingCategory.name
    const slug =
      parsed.data.slug !== undefined
        ? parsed.data.slug.trim()
        : parsed.data.name !== undefined
        ? slugify(parsed.data.name)
        : existingCategory.slug

    if (slug !== existingCategory.slug) {
      const categoryWithSlug = await categoryRepository.getCategoryBySlug(slug)
      if (categoryWithSlug && categoryWithSlug.id !== id) {
        throw new ConflictError('Đường dẫn loại biểu mẫu đã tồn tại')
      }
    }

    return await categoryRepository.updateCategory(id, { name, slug })
  },

  async deleteCategory(id: number): Promise<boolean> {
    const existingCategory = await categoryRepository.getCategoryById(id)
    if (!existingCategory) {
      throw new NotFoundError('Loại biểu mẫu không tồn tại')
    }

    return await categoryRepository.deleteCategory(id)
  },
}
