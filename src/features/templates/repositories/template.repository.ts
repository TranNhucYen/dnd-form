import { db } from '@/db'
import { template, templateCategory, user, form, schemaJson, schemaMedia } from '@/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import {
  Template,
  TemplatePricingType,
  TemplateStatus,
  GuidelineItem,
  UseTemplateResult,
} from '../types/template.type'
import { hydrateImageUrls } from '@/features/editor/utils/schema-hydrate'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

export interface ITemplateRepository {
  getTemplates(): Promise<Template[]>
  getTemplateById(id: number): Promise<Template | null>
  useTemplate(templateId: number, userId: number): Promise<UseTemplateResult>
}

export const drizzleTemplateRepository: ITemplateRepository = {
  async getTemplates(): Promise<Template[]> {
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
      .where(
        and(
          eq(template.reviewStatus, 'approved'),
          eq(template.status, 'active')
        )
      )
      .orderBy(desc(template.createdAt))

    return rows.map((r) => ({
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

  // Các bước sử dụng template có sẵn để tạo một form mới (form mới thuộc về user)
  async useTemplate(templateId: number, userId: number): Promise<UseTemplateResult> {
    return await db.transaction(async (tx) => {
      // 1. Kiểm tra template tồn tại, được duyệt và hoạt động
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

      // 2. Lấy schema gốc của template
      const [sourceSchema] = await tx
        .select()
        .from(schemaJson)
        .where(eq(schemaJson.id, tmpl.schemaId))

      if (!sourceSchema) {
        throw new Error('Không tìm thấy cấu trúc của biểu mẫu mẫu này.')
      }

      // 3. Nhân bản schema_json với type là 'form'
      const [newSchemaRes] = await tx.insert(schemaJson).values({
        schemaType: 'form',
        content: sourceSchema.content,
      })
      const newSchemaId = newSchemaRes.insertId

      // 4. Nhân bản schema_media nếu có
      const existingMedia = await tx
        .select()
        .from(schemaMedia)
        .where(eq(schemaMedia.schemaId, tmpl.schemaId))

      if (existingMedia.length > 0) {
        await tx.insert(schemaMedia).values(
          existingMedia.map((m) => ({
            schemaId: newSchemaId,
            mediaType: m.mediaType,
            signatureBase64: m.signatureBase64 ?? null,
            fileUrl: m.fileUrl ?? null,
            fileName: m.fileName ?? null,
            mimeType: m.mimeType ?? null,
            fileSize: m.fileSize ?? null,
          }))
        )
      }

      // 5. Tạo biểu mẫu mới cho user trong bảng form
      const [newFormRes] = await tx.insert(form).values({
        name: tmpl.name,
        description: tmpl.description ?? null,
        ownerId: userId,
        schemaId: newSchemaId,
        sourceTemplateId: tmpl.id,
      })
      const newFormId = newFormRes.insertId

      // 6. Tăng số lượt tải của template lên 1 
      await tx
        .update(template)
        .set({ downloads: sql`${template.downloads} + 1` })
        .where(eq(template.id, tmpl.id))

      return { formId: newFormId }
    })
  },
}