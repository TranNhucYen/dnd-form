import { db } from '@/db'
import {
  template,
  templateCategory,
  form,
  schemaJson,
  schemaMedia,
} from '@/db/schema'
import { eq, and, desc, asc } from 'drizzle-orm'
import {
  ContributionItem,
  ContributeFormInput,
  CommunityCategory,
  UserFormOption,
  ContributionStatus,
  type SourceFormData,
  type CreateContributionTemplateParams,
} from '../types/community.type'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

export type { SourceFormData, CreateContributionTemplateParams } from '../types/community.type'

export interface ICommunityRepository {
  getCategories(): Promise<CommunityCategory[]>
  getUserFormsForContribute(userId: number): Promise<UserFormOption[]>
  getMyContributions(userId: number): Promise<ContributionItem[]>
  getSourceFormData(userId: number, formId: number): Promise<SourceFormData | null>
  createContributionTemplate(params: CreateContributionTemplateParams): Promise<ContributionItem>
}

export const drizzleCommunityRepository: ICommunityRepository = {
  async getCategories(): Promise<CommunityCategory[]> {
    const rows = await db
      .select({
        id: templateCategory.id,
        name: templateCategory.name,
        slug: templateCategory.slug,
      })
      .from(templateCategory)
      .orderBy(asc(templateCategory.name))

    return rows
  },

  async getUserFormsForContribute(userId: number): Promise<UserFormOption[]> {
    const rows = await db
      .select({
        id: form.id,
        title: form.name,
      })
      .from(form)
      .where(eq(form.ownerId, userId))
      .orderBy(desc(form.updatedAt))

    return rows
  },

  async getMyContributions(userId: number): Promise<ContributionItem[]> {
    const rows = await db
      .select({
        id: template.id,
        title: template.name,
        description: template.description,
        categoryId: template.categoryId,
        categoryName: templateCategory.name,
        status: template.reviewStatus,
        submittedAt: template.createdAt,
        reviewedAt: template.updatedAt,
        feedback: template.rejectionReason,
        clonesCount: template.downloads,
        guideline: template.guideline,
      })
      .from(template)
      .leftJoin(templateCategory, eq(template.categoryId, templateCategory.id))
      .where(eq(template.createdById, userId))
      .orderBy(desc(template.createdAt))

    return rows.map((r) => {
      let guidelines: string[] = []
      if (Array.isArray(r.guideline)) {
        guidelines = r.guideline as string[]
      } else if (typeof r.guideline === 'string') {
        try {
          const parsed = JSON.parse(r.guideline)
          if (Array.isArray(parsed)) guidelines = parsed
        } catch {
          // ignore parse error
        }
      }

      return {
        id: r.id,
        title: r.title,
        description: r.description || '',
        categoryId: r.categoryId,
        categoryName: r.categoryName || 'Khác',
        status: (r.status as ContributionStatus) || ContributionStatus.PENDING,
        submittedAt: r.submittedAt.toISOString(),
        reviewedAt: r.status !== 'pending' && r.reviewedAt ? r.reviewedAt.toISOString() : undefined,
        feedback: r.feedback || undefined,
        clonesCount: r.clonesCount || 0,
        guidelines,
      }
    })
  },

  async getSourceFormData(userId: number, formId: number): Promise<SourceFormData | null> {
    const [sourceForm] = await db
      .select({ id: form.id, schemaId: form.schemaId })
      .from(form)
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)))
      .limit(1)

    if (!sourceForm) return null

    const [sourceSchema] = await db
      .select({ content: schemaJson.content })
      .from(schemaJson)
      .where(eq(schemaJson.id, sourceForm.schemaId))
      .limit(1)

    if (!sourceSchema) return null

    const mediaList = await db
      .select({
        mediaType: schemaMedia.mediaType,
        fileKey: schemaMedia.fileKey,
        fileUrl: schemaMedia.fileUrl,
        signatureBase64: schemaMedia.signatureBase64,
        fileName: schemaMedia.fileName,
        mimeType: schemaMedia.mimeType,
        fileSize: schemaMedia.fileSize,
      })
      .from(schemaMedia)
      .where(eq(schemaMedia.schemaId, sourceForm.schemaId))

    return {
      formId: sourceForm.id,
      schemaId: sourceForm.schemaId,
      schemaContent: sourceSchema.content as FormSchemaJson,
      mediaList,
    }
  },

  async createContributionTemplate({
    userId,
    input,
    schemaContent,
    mediaList,
  }: CreateContributionTemplateParams): Promise<ContributionItem> {
    return await db.transaction(async (tx) => {
      // Kiểm tra danh mục
      const [cat] = await tx
        .select()
        .from(templateCategory)
        .where(eq(templateCategory.id, input.categoryId))
        .limit(1)

      if (!cat) {
        throw new Error('Danh mục biểu mẫu không hợp lệ hoặc không tồn tại.')
      }

      // Lưu schema cho biểu mẫu mẫu
      const [schemaInsertResult] = await tx.insert(schemaJson).values({
        schemaType: 'template',
        content: schemaContent,
      })
      const newSchemaId = schemaInsertResult.insertId

      // Lưu media đính kèm nếu có
      if (mediaList.length > 0) {
        await tx.insert(schemaMedia).values(
          mediaList.map((m) => ({
            schemaId: newSchemaId,
            mediaType: m.mediaType,
            fileKey: m.fileKey ?? null,
            fileUrl: m.fileUrl,
            signatureBase64: m.signatureBase64,
            fileName: m.fileName,
            mimeType: m.mimeType,
            fileSize: m.fileSize,
          }))
        )
      }

      // Tạo biểu mẫu mẫu cộng đồng
      const cleanGuidelines = input.guidelines && input.guidelines.length > 0 ? input.guidelines : null

      const [templateInsertResult] = await tx.insert(template).values({
        name: input.title.trim(),
        createdById: userId,
        categoryId: input.categoryId,
        pricingType: 'free',
        description: input.description?.trim() || null,
        guideline: cleanGuidelines,
        reviewStatus: 'pending',
        status: 'active',
        downloads: 0,
        schemaId: newSchemaId,
      })

      const newTemplateId = templateInsertResult.insertId

      return {
        id: newTemplateId,
        sourceFormId: input.sourceFormId,
        title: input.title.trim(),
        description: input.description?.trim() || '',
        categoryId: input.categoryId,
        categoryName: cat.name,
        status: ContributionStatus.PENDING,
        submittedAt: new Date().toISOString(),
        guidelines: input.guidelines || [],
        clonesCount: 0,
      }
    })
  },
}
