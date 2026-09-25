import { db } from '@/db'
import { form, schemaJson, schemaMedia, formShare, template } from '@/db/schema'
import { and, eq, desc, sql, inArray } from 'drizzle-orm'
import { toInternalUnit } from '@/features/form-builder/domain/units'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'
import type { MyForm, CreateBlankFormInput } from '../types/my-form.type'

export interface IMyFormRepository {
  getMyForms(userId: number): Promise<MyForm[]>
  getMyFormById(formId: number, userId: number): Promise<MyForm | null>
  createBlankForm(userId: number, input: CreateBlankFormInput): Promise<MyForm>
  duplicateForm(formId: number, userId: number, customName?: string): Promise<MyForm | null>
  deleteForm(formId: number, userId: number): Promise<boolean>
}

/** Cấu hình schema rỗng mặc định khổ A4 - portrait */
const DEFAULT_BLANK_SCHEMA: FormSchemaJson = {
  page: {
    preset: 'A4',
    orientation: 'PORTRAIT',
    dimensions: {
      width: toInternalUnit(210),
      height: toInternalUnit(297),
    },
    margins: {
      top: toInternalUnit(20),
      right: toInternalUnit(20),
      bottom: toInternalUnit(20),
      left: toInternalUnit(20),
    },
  },
  fields: [],
}

export const drizzleMyFormRepository: IMyFormRepository = {
  async getMyForms(userId: number): Promise<MyForm[]> {
    const records = await db
      .select({
        id: form.id,
        name: form.name,
        description: form.description,
        sourceTemplateId: form.sourceTemplateId,
        sourceTemplateName: template.name,
        schemaId: form.schemaId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        fieldsCount: sql<number>`COALESCE(JSON_LENGTH(${schemaJson.content}, '$.fields'), 0)`,
      })
      .from(form)
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .leftJoin(template, eq(form.sourceTemplateId, template.id))
      .where(eq(form.ownerId, userId))
      .orderBy(desc(form.updatedAt))

    if (records.length === 0) {
      return []
    }

    const formIds = records.map((r) => r.id)
    const publicShares = await db
      .select({
        formId: formShare.formId,
      })
      .from(formShare)
      .where(
        and(
          inArray(formShare.formId, formIds),
          eq(formShare.subjectType, 'link')
        )
      )

    const publicFormIdSet = new Set(publicShares.map((s) => s.formId))

    return records.map((record) => {
      const isPublic = publicFormIdSet.has(record.id)
      return {
        id: record.id,
        name: record.name,
        description: record.description,
        fieldsCount: Number(record.fieldsCount) || 0,
        isPublic,
        sourceTemplateId: record.sourceTemplateId,
        sourceTemplateName: record.sourceTemplateName,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      }
    })
  },

  async getMyFormById(formId: number, userId: number): Promise<MyForm | null> {
    const [record] = await db
      .select({
        id: form.id,
        name: form.name,
        description: form.description,
        sourceTemplateId: form.sourceTemplateId,
        sourceTemplateName: template.name,
        schemaId: form.schemaId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        fieldsCount: sql<number>`COALESCE(JSON_LENGTH(${schemaJson.content}, '$.fields'), 0)`,
      })
      .from(form)
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .leftJoin(template, eq(form.sourceTemplateId, template.id))
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)))

    if (!record) {
      return null
    }

    const [publicShare] = await db
      .select({ formId: formShare.formId })
      .from(formShare)
      .where(
        and(
          eq(formShare.formId, formId),
          eq(formShare.subjectType, 'link')
        )
      )

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      fieldsCount: Number(record.fieldsCount) || 0,
      isPublic: Boolean(publicShare),
      sourceTemplateId: record.sourceTemplateId,
      sourceTemplateName: record.sourceTemplateName,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }
  },

  async createBlankForm(userId: number, input: CreateBlankFormInput): Promise<MyForm> {
    return await db.transaction(async (tx) => {
      // Tạo bản ghi schema rỗng mặc định
      const [schemaResult] = await tx.insert(schemaJson).values({
        schemaType: 'form',
        content: DEFAULT_BLANK_SCHEMA,
      })
      const schemaId = schemaResult.insertId

      // Tạo bản ghi biểu mẫu gắn với schemaId và ownerId
      const [formResult] = await tx.insert(form).values({
        name: input.name,
        description: input.description ?? null,
        ownerId: userId,
        schemaId,
        sourceTemplateId: input.sourceTemplateId ?? null,
      })
      const formId = formResult.insertId

      const now = new Date().toISOString()
      return {
        id: formId,
        name: input.name,
        description: input.description ?? null,
        fieldsCount: 0,
        isPublic: false,
        sourceTemplateId: input.sourceTemplateId ?? null,
        createdAt: now,
        updatedAt: now,
      }
    })
  },

  async duplicateForm(
    formId: number,
    userId: number,
    customName?: string
  ): Promise<MyForm | null> {
    return await db.transaction(async (tx) => {
      // Kiểm tra quyền sở hữu biểu mẫu gốc
      const [existingForm] = await tx
        .select()
        .from(form)
        .where(and(eq(form.id, formId), eq(form.ownerId, userId)))

      if (!existingForm) {
        return null
      }

      const [existingSchema] = await tx
        .select()
        .from(schemaJson)
        .where(eq(schemaJson.id, existingForm.schemaId))

      if (!existingSchema) {
        return null
      }

      // Nhân bản schema_json
      const [newSchemaResult] = await tx.insert(schemaJson).values({
        schemaType: existingSchema.schemaType,
        content: existingSchema.content,
      })
      const newSchemaId = newSchemaResult.insertId

      // Nhân bản media đính kèm nếu có
      const existingMedia = await tx
        .select()
        .from(schemaMedia)
        .where(eq(schemaMedia.schemaId, existingForm.schemaId))

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

      // Tạo bản ghi biểu mẫu mới với tên bản sao
      const newName =
        customName && customName.trim()
          ? customName.trim()
          : `${existingForm.name} (Bản sao)`

      const [newFormResult] = await tx.insert(form).values({
        name: newName,
        description: existingForm.description,
        ownerId: userId,
        schemaId: newSchemaId,
        sourceTemplateId: existingForm.sourceTemplateId,
      })
      const newFormId = newFormResult.insertId

      const schemaContent = existingSchema.content as FormSchemaJson
      const fieldsCount = Array.isArray(schemaContent?.fields) ? schemaContent.fields.length : 0

      const now = new Date().toISOString()
      return {
        id: newFormId,
        name: newName,
        description: existingForm.description,
        fieldsCount,
        isPublic: false,
        sourceTemplateId: existingForm.sourceTemplateId,
        createdAt: now,
        updatedAt: now,
      }
    })
  },

  async deleteForm(formId: number, userId: number): Promise<boolean> {
    return await db.transaction(async (tx) => {
      // Kiểm tra quyền sở hữu biểu mẫu
      const [existingForm] = await tx
        .select({ id: form.id, schemaId: form.schemaId })
        .from(form)
        .where(and(eq(form.id, formId), eq(form.ownerId, userId)))

      if (!existingForm) {
        return false
      }

      const schemaId = existingForm.schemaId

      await tx.delete(formShare).where(eq(formShare.formId, formId))

      await tx.delete(form).where(eq(form.id, formId))

      await tx.delete(schemaMedia).where(eq(schemaMedia.schemaId, schemaId))

      await tx.delete(schemaJson).where(eq(schemaJson.id, schemaId))

      return true
    })
  },
}
