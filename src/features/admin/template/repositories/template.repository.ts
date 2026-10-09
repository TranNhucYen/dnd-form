import { db } from '@/db'
import { template, templateCategory, user } from '@/db/schema'
import { eq, desc, asc, and, or, like, count, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'
import {
  AdminTemplate,
  TemplateStatus,
  UpdateTemplateInput,
  TemplatePaginationParams,
  TemplatePaginatedResult,
} from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { formatAdminTemplate } from '../utils/template.util'
import { formatDate } from '@/shared/utils'

// Join cùng 1 bảng user 2 lần vào bảng template (dùng để lấy thông tin cả 2 user trong 1 query)
const creator = alias(user, 'creator')
const approver = alias(user, 'approver')

export async function getTemplateCount(
  search: string = '',
  status?: string
): Promise<number> {
  const conditions: any[] = []

  if (status && status !== 'all') {
    conditions.push(eq(template.reviewStatus, status as any))
  }

  if (search) {
    conditions.push(
      or(
        like(template.name, `%${search}%`),
        like(creator.fullName, `%${search}%`),
        like(templateCategory.name, `%${search}%`)
      )
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const subquery = db
    .select({ id: template.id })
    .from(template)
    .leftJoin(creator, eq(template.createdById, creator.id))
    .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
    .where(whereClause)
    .limit(10000)
    .as('subquery')

  const [countRes] = await db
    .select({ count: count() })
    .from(subquery)

  return countRes?.count ?? 0
}

export async function getTemplateTabCounts(): Promise<{
  all: number
  pending: number
  approved: number
  rejected: number
}> {
  const subquery = db
    .select({ reviewStatus: template.reviewStatus })
    .from(template)
    .limit(10000)
    .as('subquery')

  const [countsRes] = await db
    .select({
      all: count(),
      pending: count(sql`CASE WHEN ${subquery.reviewStatus} = 'pending' THEN 1 END`),
      approved: count(sql`CASE WHEN ${subquery.reviewStatus} = 'approved' THEN 1 END`),
      rejected: count(sql`CASE WHEN ${subquery.reviewStatus} = 'rejected' THEN 1 END`),
    })
    .from(subquery)

  return {
    all: countsRes?.all ?? 0,
    pending: countsRes?.pending ?? 0,
    approved: countsRes?.approved ?? 0,
    rejected: countsRes?.rejected ?? 0,
  }
}

export interface ITemplateRepository {
  getTemplates(params?: TemplatePaginationParams): Promise<TemplatePaginatedResult>
  getTemplateById(id: number): Promise<AdminTemplate | null>
  updateTemplate(id: number, data: UpdateTemplateInput, adminUserId?: number): Promise<AdminTemplate | null>
  getCategories(): Promise<Category[]>
}

export const drizzleTemplateRepository: ITemplateRepository = {
  async getTemplates(params?: TemplatePaginationParams): Promise<TemplatePaginatedResult> {
    const page = Math.max(1, Number(params?.page) || 1)
    const pageSize = Math.min(100, Math.max(1, Number(params?.pageSize) || 8))
    const offset = (page - 1) * pageSize
    const search = params?.search?.trim() || ''
    const status = params?.status

    const conditions: any[] = []

    if (status && status !== 'all') {
      conditions.push(eq(template.reviewStatus, status))
    }

    if (search) {
      conditions.push(
        or(
          like(template.name, `%${search}%`),
          like(creator.fullName, `%${search}%`),
          like(templateCategory.name, `%${search}%`)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [rows, totalItems, counts] = await Promise.all([
      db
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
        .where(whereClause)
        .orderBy(desc(template.createdAt))
        .limit(pageSize)
        .offset(offset),
      getTemplateCount(search, status),
      getTemplateTabCounts(),
    ])

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    return {
      items: rows.map(formatAdminTemplate),
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      counts,
    }
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
      createdAt: formatDate(r.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric' }) || undefined,
    }))
  },
}
