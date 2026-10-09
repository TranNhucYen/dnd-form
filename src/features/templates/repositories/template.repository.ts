import { db } from '@/db'
import { template, templateCategory, user, form, schemaJson, schemaMedia } from '@/db/schema'
import { eq, and, or, like, desc, sql, count } from 'drizzle-orm'
import {
  Template,
  TemplatePricingType,
  TemplateStatus,
  GuidelineItem,
  UseTemplateResult,
  GetTemplatesParams,
  PaginatedTemplates,
} from '../types/template.type'
import { hydrateImageUrls } from '@/features/editor/utils/schema-hydrate'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'
import { sanitizeSignatureFromSchema, filterTemplateMedia } from '../utils/sanitize'

export interface ITemplateRepository {
  getTemplates(params?: GetTemplatesParams): Promise<PaginatedTemplates>
  getCategories(): Promise<string[]>
  getTemplateById(id: number): Promise<Template | null>
  useTemplate(templateId: number, userId: number): Promise<UseTemplateResult>
}

export const drizzleTemplateRepository: ITemplateRepository = {
  async getCategories(): Promise<string[]> {
    const rows = await db
      .select({ name: templateCategory.name })
      .from(templateCategory)
      .orderBy(templateCategory.name)

    return rows.map((r) => r.name)
  },

  async getTemplates(params?: GetTemplatesParams): Promise<PaginatedTemplates> {
    const page = Math.max(1, params?.page ?? 1)
    const pageSize = Math.max(1, params?.pageSize ?? 25)
    const search = params?.search?.trim()
    const categoryName = params?.categoryName

    const conditions = [
      eq(template.reviewStatus, 'approved'),
      eq(template.status, 'active'),
    ]

    if (categoryName && categoryName !== 'all') {
      conditions.push(eq(templateCategory.name, categoryName))
    }

    if (search) {
      conditions.push(
        or(
          like(template.name, `%${search}%`),
          like(template.description, `%${search}%`)
        )!
      )
    }

    const whereClause = and(...conditions)

    const [countRes] = await db
      .select({ count: count() })
      .from(template)
      .leftJoin(user, eq(template.createdById, user.id))
      .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
      .where(whereClause)

    const total = countRes?.count ?? 0
    const offset = (page - 1) * pageSize

    const rows = await db
      .select({
        id: template.id,
        name: template.name,
        createdById: template.createdById,
        ownerName: user.fullName,
        categoryId: template.categoryId,
        categoryName: templateCategory.name,
        pricingType: template.pricingType,
        status: template.status,
        description: template.description,
        guideline: template.guideline,
        downloads: template.downloads,
        schemaId: template.schemaId,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      })
      .from(template)
      .leftJoin(user, eq(template.createdById, user.id))
      .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
      .where(whereClause)
      .orderBy(desc(template.createdAt), desc(template.id))
      .limit(pageSize)
      .offset(offset)

    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      ownerId: r.createdById,
      ownerName: r.ownerName || 'Hệ thống',
      categoryId: r.categoryId,
      categoryName: r.categoryName || 'Chung',
      pricingType: (r.pricingType as TemplatePricingType) || TemplatePricingType.FREE,
      status: (r.status as TemplateStatus) || TemplateStatus.ACTIVE,
      description: r.description ?? null,
      guideline: (r.guideline as (GuidelineItem | string)[]) ?? null,
      downloads: r.downloads ?? 0,
      schemaId: r.schemaId,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))

    return {
      items,
      total,
      page,
      pageSize,
      hasMore: offset + items.length < total,
    }
  },

  async getTemplateById(id: number): Promise<Template | null> {
    const [row] = await db
      .select({
        id: template.id,
        name: template.name,
        createdById: template.createdById,
        ownerName: user.fullName,
        categoryId: template.categoryId,
        categoryName: templateCategory.name,
        pricingType: template.pricingType,
        status: template.status,
        description: template.description,
        guideline: template.guideline,
        downloads: template.downloads,
        schemaId: template.schemaId,
        schemaContent: schemaJson.content,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      })
      .from(template)
      .leftJoin(user, eq(template.createdById, user.id))
      .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
      .leftJoin(schemaJson, eq(template.schemaId, schemaJson.id))
      .where(
        and(
          eq(template.id, id),
          eq(template.reviewStatus, 'approved'),
          eq(template.status, 'active')
        )
      )

    if (!row) return null

    const schemaContent = (row.schemaContent as FormSchemaJson) ?? null
    if (schemaContent) {
      hydrateImageUrls(schemaContent)
    }

    return {
      id: row.id,
      name: row.name,
      ownerId: row.createdById,
      ownerName: row.ownerName || 'Hệ thống',
      categoryId: row.categoryId,
      categoryName: row.categoryName || 'Chung',
      pricingType: (row.pricingType as TemplatePricingType) || TemplatePricingType.FREE,
      status: (row.status as TemplateStatus) || TemplateStatus.ACTIVE,
      description: row.description ?? null,
      guideline: (row.guideline as (GuidelineItem | string)[]) ?? null,
      downloads: row.downloads ?? 0,
      schemaId: row.schemaId,
      schemaContent: schemaContent ?? undefined,
      createdAt: row.createdAt?.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }
  },

  // Tạo biểu mẫu mới từ biểu mẫu mẫu
  async useTemplate(templateId: number, userId: number): Promise<UseTemplateResult> {
    return await db.transaction(async (tx) => {
      // Kiểm tra biểu mẫu mẫu tồn tại và hợp lệ
      const [tmpl] = await tx
        .select()
        .from(template)
        .where(
          and(
            eq(template.id, templateId),
            eq(template.reviewStatus, 'approved'),
            eq(template.status, 'active')
          )
        )

      if (!tmpl) {
        throw new Error('Biểu mẫu mẫu không tồn tại hoặc chưa được kích hoạt.')
      }

      // Lấy cấu trúc schema gốc
      const [sourceSchema] = await tx
        .select()
        .from(schemaJson)
        .where(eq(schemaJson.id, tmpl.schemaId))

      if (!sourceSchema) {
        throw new Error('Không tìm thấy cấu trúc của biểu mẫu mẫu này.')
      }

      // Nhân bản schema và xóa chữ ký cũ nếu có
      const sanitizedContent = sanitizeSignatureFromSchema(sourceSchema.content as FormSchemaJson) ?? sourceSchema.content

      const [newSchemaRes] = await tx.insert(schemaJson).values({
        schemaType: 'form',
        content: sanitizedContent,
      })
      const newSchemaId = newSchemaRes.insertId

      // Nhân bản media (bỏ qua chữ ký)
      const existingMedia = await tx
        .select()
        .from(schemaMedia)
        .where(eq(schemaMedia.schemaId, tmpl.schemaId))

      const mediaToClone = filterTemplateMedia(existingMedia)

      if (mediaToClone.length > 0) {
        await tx.insert(schemaMedia).values(
          mediaToClone.map((m) => ({
            schemaId: newSchemaId,
            mediaType: m.mediaType,
            fileKey: m.fileKey ?? null,
            signatureBase64: null,
            fileUrl: m.fileUrl ?? null,
            fileName: m.fileName ?? null,
            mimeType: m.mimeType ?? null,
            fileSize: m.fileSize ?? null,
          }))
        )
      }

      // Tạo biểu mẫu mới cho người dùng
      const [newFormRes] = await tx.insert(form).values({
        name: tmpl.name,
        description: tmpl.description ?? null,
        ownerId: userId,
        schemaId: newSchemaId,
        sourceTemplateId: tmpl.id,
      })
      const newFormId = newFormRes.insertId

      // Tăng lượt tải của biểu mẫu mẫu
      await tx
        .update(template)
        .set({ downloads: sql`${template.downloads} + 1` })
        .where(eq(template.id, tmpl.id))

      return { formId: newFormId }
    })
  },
}