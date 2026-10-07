import { db } from '@/db'
import { templateCategory } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.type'

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>
  getCategoryById(id: number): Promise<Category | null>
  getCategoryBySlug(slug: string): Promise<Category | null>
  createCategory(data: CreateCategoryInput): Promise<Category>
  updateCategory(id: number, data: UpdateCategoryInput): Promise<Category | null>
  deleteCategory(id: number): Promise<boolean>
}

export const drizzleCategoryRepository: ICategoryRepository = {
  async getCategories(): Promise<Category[]> {
    const rows = await db
      .select()
      .from(templateCategory)
      .orderBy(desc(templateCategory.createdAt)) 

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      createdAt: r.createdAt
        ? r.createdAt.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric', 
          })
        : undefined,
    }))
  },

  async getCategoryById(id: number): Promise<Category | null> {
    const [found] = await db
      .select()
      .from(templateCategory)
      .where(eq(templateCategory.id, id))
      .limit(1)

    if (!found) return null

    return {
      id: found.id,
      name: found.name,
      slug: found.slug,
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const [found] = await db
      .select()
      .from(templateCategory)
      .where(eq(templateCategory.slug, slug.trim()))
      .limit(1)

    if (!found) return null

    return {
      id: found.id,
      name: found.name,
      slug: found.slug,
    }
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const slug = data.slug?.trim() || data.name.trim()
    const [result] = await db.insert(templateCategory).values({
      name: data.name.trim(),
      slug,
    })

    const created = await this.getCategoryById(result.insertId)
    return created!
  },

  async updateCategory(id: number, data: UpdateCategoryInput): Promise<Category | null> {
    const updateData: Partial<typeof templateCategory.$inferInsert> = {}
    if (data.name !== undefined) updateData.name = data.name.trim()
    if (data.slug !== undefined) updateData.slug = data.slug.trim()

    if (Object.keys(updateData).length > 0) {
      await db.update(templateCategory).set(updateData).where(eq(templateCategory.id, id))
    }

    return await this.getCategoryById(id)
  },

  async deleteCategory(id: number): Promise<boolean> {
    const [result] = await db.delete(templateCategory).where(eq(templateCategory.id, id))
    return result.affectedRows > 0
  },
}

