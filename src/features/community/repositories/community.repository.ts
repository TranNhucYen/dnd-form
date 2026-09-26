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
} from '../types/community.type'

export interface ICommunityRepository {
  getCategories(): Promise<CommunityCategory[]>
  getUserFormsForContribute(userId: number): Promise<UserFormOption[]>
  getMyContributions(userId: number): Promise<ContributionItem[]>
  submitContribution(userId: number, input: ContributeFormInput): Promise<ContributionItem>
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

  async submitContribution(userId: number, input: ContributeFormInput): Promise<ContributionItem> {
    return await db.transaction(async (tx) => {
      // Kiểm tra biểu mẫu nguồn và quyền sở hữu (chống IDOR)
      const [sourceForm] = await tx
        .select()
        .from(form)
        .where(and(eq(form.id, input.sourceFormId), eq(form.ownerId, userId)))
        .limit(1)

      if (!sourceForm) {
        throw new Error('Biểu mẫu nguồn không tồn tại hoặc bạn không có quyền sở hữu.')
      }

      // Đọc cấu trúc schema_json của biểu mẫu nguồn
      const [sourceSchema] = await tx
        .select()
        .from(schemaJson)
        .where(eq(schemaJson.id, sourceForm.schemaId))
        .limit(1)

      if (!sourceSchema) {
        throw new Error('Không tìm thấy dữ liệu cấu trúc của biểu mẫu nguồn.')
      }

      // Nhân bản schema_json độc lập với schemaType: 'template'
      const [schemaInsertResult] = await tx.insert(schemaJson).values({
        schemaType: 'template',
        content: sourceSchema.content,
      })
      const newSchemaId = schemaInsertResult.insertId

      // Nhân bản media liên quan nếu có
      const existingMedia = await tx
        .select()
        .from(schemaMedia)
        .where(eq(schemaMedia.schemaId, sourceForm.schemaId))

      if (existingMedia.length > 0) {
        await tx.insert(schemaMedia).values(
          existingMedia.map((m) => ({
            schemaId: newSchemaId,
            mediaType: m.mediaType,
            fileUrl: m.fileUrl,
            signatureBase64: m.signatureBase64,
            fileName: m.fileName,
            mimeType: m.mimeType,
            fileSize: m.fileSize,
          }))
        )
      }

      // Kiểm tra danh mục
      const [cat] = await tx
        .select()
        .from(templateCategory)
        .where(eq(templateCategory.id, input.categoryId))
        .limit(1)

      if (!cat) {
        throw new Error('Danh mục biểu mẫu không hợp lệ hoặc không tồn tại.')
      }

      // Tạo bản ghi template cộng đồng mới
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
