import crypto from 'crypto'
import { db } from '@/db'
import { form, schemaJson, schemaMedia, formShare, template, user } from '@/db/schema'
import { and, eq, desc, sql, inArray } from 'drizzle-orm'
import { toInternalUnit } from '@/features/form-builder/domain/units'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'
import { hydrateImageUrls } from '@/features/editor/utils/schema-hydrate'
import type {
  MyForm,
  CreateBlankFormInput,
  SaveSharingInput,
  ShareTokenResult,
  PublicFormDetail,
  SharedUser,
  ShareRole,
} from '../types/my-form.type'

export interface IMyFormRepository {
  getMyForms(userId: number): Promise<MyForm[]>
  getMyFormById(formId: number, userId: number): Promise<MyForm | null>
  createBlankForm(userId: number, input: CreateBlankFormInput): Promise<MyForm>
  duplicateForm(formId: number, userId: number, customName?: string): Promise<MyForm | null>
  deleteForm(formId: number, userId: number): Promise<boolean>
  getFormShareToken(formId: number, userId: number): Promise<ShareTokenResult>
  saveFormSharing(formId: number, userId: number, input: SaveSharingInput): Promise<ShareTokenResult>
  getPublicFormByToken(token: string): Promise<PublicFormDetail | null>
}

/** Cấu hình schema rỗng mặc định khổ A4 - portrait */
const DEFAULT_BLANK_SCHEMA: FormSchemaJson = {
  pages: [
    {
      id: 'page_1',
      pageNumber: 1,
      name: 'Trang 1',
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
    },
  ],
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

    const userShares = await db
      .select({
        formId: formShare.formId,
        id: formShare.id,
        permission: formShare.permission,
        email: user.email,
        createdAt: formShare.createdAt,
      })
      .from(formShare)
      .innerJoin(user, eq(formShare.userId, user.id))
      .where(
        and(
          inArray(formShare.formId, formIds),
          eq(formShare.subjectType, 'user')
        )
      )

    const sharedUsersMap = new Map<number, SharedUser[]>()
    for (const s of userShares) {
      const list = sharedUsersMap.get(s.formId) || []
      list.push({
        id: String(s.id),
        email: s.email,
        role: s.permission as ShareRole,
        addedAt: s.createdAt.toISOString(),
      })
      sharedUsersMap.set(s.formId, list)
    }

    return records.map((record) => {
      const isPublic = publicFormIdSet.has(record.id)
      const sharedWith = sharedUsersMap.get(record.id) || []
      return {
        id: record.id,
        name: record.name,
        description: record.description,
        fieldsCount: Number(record.fieldsCount) || 0,
        isPublic,
        sharedWith,
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

    const userShares = await db
      .select({
        id: formShare.id,
        permission: formShare.permission,
        email: user.email,
        createdAt: formShare.createdAt,
      })
      .from(formShare)
      .innerJoin(user, eq(formShare.userId, user.id))
      .where(
        and(
          eq(formShare.formId, formId),
          eq(formShare.subjectType, 'user')
        )
      )

    const sharedWith: SharedUser[] = userShares.map((s) => ({
      id: String(s.id),
      email: s.email,
      role: s.permission as ShareRole,
      addedAt: s.createdAt.toISOString(),
    }))

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      fieldsCount: Number(record.fieldsCount) || 0,
      isPublic: Boolean(publicShare),
      sharedWith,
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
            fileKey: m.fileKey ?? null,
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
      const fieldsCount = Array.isArray(schemaContent?.pages)
        ? schemaContent.pages.reduce((acc, p) => acc + (p.fields?.length || 0), 0)
        : 0

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

  async getFormShareToken(formId: number, userId: number): Promise<ShareTokenResult> {
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)))

    if (!formRecord) {
      throw new Error('Không tìm thấy biểu mẫu hoặc bạn không có quyền')
    }

    const [linkShare] = await db
      .select({ token: formShare.token })
      .from(formShare)
      .where(and(eq(formShare.formId, formId), eq(formShare.subjectType, 'link')))

    const userShares = await db
      .select({
        id: formShare.id,
        permission: formShare.permission,
        email: user.email,
        createdAt: formShare.createdAt,
      })
      .from(formShare)
      .innerJoin(user, eq(formShare.userId, user.id))
      .where(and(eq(formShare.formId, formId), eq(formShare.subjectType, 'user')))

    const sharedWith: SharedUser[] = userShares.map((s) => ({
      id: String(s.id),
      email: s.email,
      role: s.permission as ShareRole,
      addedAt: s.createdAt.toISOString(),
    }))

    const token = linkShare?.token ?? null
    return {
      isPublic: Boolean(linkShare),
      token,
      shareUrl: token ? `/share/${token}` : null,
      sharedWith,
    }
  },

  async saveFormSharing(
    formId: number,
    userId: number,
    input: SaveSharingInput
  ): Promise<ShareTokenResult> {
    return await db.transaction(async (tx) => {
      const [formRecord] = await tx
        .select({ id: form.id })
        .from(form)
        .where(and(eq(form.id, formId), eq(form.ownerId, userId)))

      if (!formRecord) {
        throw new Error('Không tìm thấy biểu mẫu hoặc bạn không có quyền chia sẻ')
      }

      // Xử lý chia sẻ qua link (public)
      const [existingLinkShare] = await tx
        .select()
        .from(formShare)
        .where(and(eq(formShare.formId, formId), eq(formShare.subjectType, 'link')))

      let token = existingLinkShare?.token ?? null

      if (input.isPublic) {
        if (!token) {
          token = crypto.randomBytes(16).toString('hex')
        }
        if (existingLinkShare) {
          await tx
            .update(formShare)
            .set({ token, permission: 'view', updatedAt: new Date() })
            .where(eq(formShare.id, existingLinkShare.id))
        } else {
          await tx.insert(formShare).values({
            formId,
            subjectType: 'link',
            permission: 'view',
            token,
          })
        }
      } else {
        if (existingLinkShare) {
          await tx.delete(formShare).where(eq(formShare.id, existingLinkShare.id))
        }
        token = null
      }

      // Xử lý danh sách người dùng được chia sẻ
      if (input.sharedUsers !== undefined) {
        const currentShares = await tx
          .select({
            id: formShare.id,
            userId: formShare.userId,
            email: user.email,
          })
          .from(formShare)
          .innerJoin(user, eq(formShare.userId, user.id))
          .where(and(eq(formShare.formId, formId), eq(formShare.subjectType, 'user')))

        const currentEmailMap = new Map(currentShares.map((s) => [s.email.toLowerCase(), s]))
        const incomingEmails = new Set(input.sharedUsers.map((u) => u.email.trim().toLowerCase()))

        // Xóa những người dùng đã bị xóa khỏi danh sách
        for (const [currEmail, shareRecord] of currentEmailMap.entries()) {
          if (!incomingEmails.has(currEmail)) {
            await tx.delete(formShare).where(eq(formShare.id, shareRecord.id))
          }
        }

        // Cập nhật hoặc thêm mới người dùng trong danh sách
        for (const item of input.sharedUsers) {
          const cleanEmail = item.email.trim().toLowerCase()
          if (!cleanEmail) continue

          const [targetUser] = await tx
            .select({ id: user.id })
            .from(user)
            .where(eq(user.email, cleanEmail))

          if (!targetUser) {
            throw new Error(`Không tìm thấy người dùng với email "${item.email}" trong hệ thống`)
          }

          if (targetUser.id === userId) {
            throw new Error('Không thể tự chia sẻ biểu mẫu cho chính mình')
          }

          const role = item.role === 'edit' ? 'edit' : 'view'
          const existing = currentEmailMap.get(cleanEmail)

          if (existing) {
            await tx
              .update(formShare)
              .set({ permission: role, updatedAt: new Date() })
              .where(eq(formShare.id, existing.id))
          } else {
            await tx.insert(formShare).values({
              formId,
              userId: targetUser.id,
              subjectType: 'user',
              permission: role,
            })
          }
        }
      } else if (input.email && input.email.trim()) {
        const cleanEmail = input.email.trim().toLowerCase()
        const [targetUser] = await tx
          .select({ id: user.id, email: user.email })
          .from(user)
          .where(eq(user.email, cleanEmail))

        if (!targetUser) {
          throw new Error('Không tìm thấy người dùng với email này trong hệ thống')
        }

        if (targetUser.id === userId) {
          throw new Error('Không thể tự chia sẻ biểu mẫu cho chính mình')
        }

        const role = input.role === 'edit' ? 'edit' : 'view'

        const [existingUserShare] = await tx
          .select()
          .from(formShare)
          .where(
            and(
              eq(formShare.formId, formId),
              eq(formShare.userId, targetUser.id),
              eq(formShare.subjectType, 'user')
            )
          )

        if (existingUserShare) {
          await tx
            .update(formShare)
            .set({ permission: role, updatedAt: new Date() })
            .where(eq(formShare.id, existingUserShare.id))
        } else {
          await tx.insert(formShare).values({
            formId,
            userId: targetUser.id,
            subjectType: 'user',
            permission: role,
          })
        }
      }

      // Lấy danh sách thành viên chia sẻ mới nhất sau khi cập nhật
      const updatedUserShares = await tx
        .select({
          id: formShare.id,
          permission: formShare.permission,
          email: user.email,
          createdAt: formShare.createdAt,
        })
        .from(formShare)
        .innerJoin(user, eq(formShare.userId, user.id))
        .where(and(eq(formShare.formId, formId), eq(formShare.subjectType, 'user')))

      const sharedWith: SharedUser[] = updatedUserShares.map((s) => ({
        id: String(s.id),
        email: s.email,
        role: s.permission as ShareRole,
        addedAt: s.createdAt.toISOString(),
      }))

      return {
        isPublic: input.isPublic,
        token,
        shareUrl: token ? `/share/${token}` : null,
        sharedWith,
      }
    })
  },

  async getPublicFormByToken(token: string): Promise<PublicFormDetail | null> {
    if (!token || !token.trim()) {
      return null
    }

    const [formRecord] = await db
      .select({
        id: form.id,
        name: form.name,
        description: form.description,
        schemaContent: schemaJson.content,
      })
      .from(formShare)
      .innerJoin(form, eq(formShare.formId, form.id))
      .innerJoin(user, eq(form.ownerId, user.id))
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .where(
        and(
          eq(formShare.token, token),
          eq(formShare.subjectType, 'link'),
          eq(user.status, 'active')
        )
      )
      .limit(1)

    if (!formRecord) {
      return null
    }

    const schemaContent = formRecord.schemaContent as FormSchemaJson
    hydrateImageUrls(schemaContent)

    return {
      id: formRecord.id,
      name: formRecord.name,
      description: formRecord.description,
      schemaContent,
    }
  },
}
