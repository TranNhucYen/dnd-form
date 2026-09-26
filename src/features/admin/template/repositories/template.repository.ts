import { db } from '@/db'
import { template, templateCategory, user } from '@/db/schema'
import { eq, desc, asc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'
import { AdminTemplate, TemplateStatus, UpdateTemplateInput } from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { formatAdminTemplate } from '../utils/template.util'

export interface ITemplateRepository {
  getTemplates(): Promise<AdminTemplate[]>
  getTemplateById(id: number): Promise<AdminTemplate | null>
  updateTemplate(id: number, data: UpdateTemplateInput, adminUserId?: number): Promise<AdminTemplate | null>
  getCategories(): Promise<Category[]>
}

// Join cùng 1 bảng user 2 lần vào bảng template (dùng để lấy thông tin cả 2 user trong 1 query)
const creator = alias(user, 'creator')
const approver = alias(user, 'approver')

export const drizzleTemplateRepository: ITemplateRepository = {
  async getTemplates(): Promise<AdminTemplate[]> {
    const rows = await db
      .select({
        id: template.id,
        name: template.name,
        createdById: template.createdById,
        creatorName: creator.fullName,
        creatorEmail: creator.email,
        approvedById: template.approvedById,
        approverName: approver.fullName,
        approverEmail: approver.email,
        categoryId: template.categoryId,
        categoryName: templateCategory.name,
        categorySlug: templateCategory.slug,
        pricingType: template.pricingType,
        description: template.description,
        guideline: template.guideline,
        reviewStatus: template.reviewStatus,
        status: template.status,
        rejectionReason: template.rejectionReason,
        downloads: template.downloads,
        createdAt: template.createdAt,
      })
      .from(template)
      .leftJoin(creator, eq(template.createdById, creator.id))
      .leftJoin(approver, eq(template.approvedById, approver.id))
      .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
      .orderBy(desc(template.createdAt))

    return rows.map(formatAdminTemplate)
  },

  async getTemplateById(id: number): Promise<AdminTemplate | null> {
    const rows = await db
      .select({
        id: template.id,
        name: template.name,
        createdById: template.createdById,
        creatorName: creator.fullName,
        creatorEmail: creator.email,
        approvedById: template.approvedById,
        approverName: approver.fullName,
        approverEmail: approver.email,
        categoryId: template.categoryId,

        categoryName: templateCategory.name,
        categorySlug: templateCategory.slug,
        pricingType: template.pricingType,
        description: template.description,
        guideline: template.guideline,
        reviewStatus: template.reviewStatus,
        status: template.status,
        rejectionReason: template.rejectionReason,
        downloads: template.downloads,
        createdAt: template.createdAt,
      })
      .from(template)
      .leftJoin(creator, eq(template.createdById, creator.id))
      .leftJoin(approver, eq(template.approvedById, approver.id))
      .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
      .where(eq(template.id, id))
      .limit(1)

    return rows.length > 0 ? formatAdminTemplate(rows[0]) : null
  },

  async updateTemplate(
    id: number,
    data: UpdateTemplateInput,
    adminUserId?: number
  ): Promise<AdminTemplate | null> {
    const updateData: Partial<typeof template.$inferInsert> = {}

    if (data.title !== undefined) updateData.name = data.title.trim()
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.isPaid !== undefined) updateData.pricingType = data.isPaid ? 'paid' : 'free'
    if (data.description !== undefined) updateData.description = data.description.trim()

    if (data.guidelines !== undefined) {
      const cleanGuidelines = data.guidelines.map((g) => g.trim()).filter(Boolean)
      updateData.guideline = cleanGuidelines.length > 0 ? cleanGuidelines : null
    }

    if (data.review_status !== undefined) {
      updateData.reviewStatus = data.review_status
      if (data.review_status === TemplateStatus.APPROVED) {
        if (adminUserId) updateData.approvedById = adminUserId
        updateData.rejectionReason = null
        if (data.status === undefined) updateData.status = 'active'
      } else if (data.review_status === TemplateStatus.REJECTED) {
        updateData.rejectionReason = data.rejectReason?.trim() || null
        updateData.approvedById = null
        if (data.status === undefined) updateData.status = 'blocked'
      } else if (data.review_status === TemplateStatus.PENDING) {
        updateData.rejectionReason = null
        updateData.approvedById = null
      }
    }

    if (data.rejectReason !== undefined && data.review_status === undefined) {
      updateData.rejectionReason = data.rejectReason.trim()
    }

    if (data.status !== undefined) {
      updateData.status = data.status === 'block' ? 'blocked' : data.status === 'active' ? 'active' : null
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(template)
        .set(updateData)
        .where(eq(template.id, id))
    }

    return await this.getTemplateById(id)
  },

  async getCategories(): Promise<Category[]> {
    const rows = await db
      .select()
      .from(templateCategory)
      .orderBy(asc(templateCategory.name))

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      createdAt: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : undefined,
    }))
  },
}
