import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { template, schemaJson } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hydrateImageUrls } from '@/features/editor/utils/schema-hydrate'
import { PublicFormViewer } from '@/features/my-form/components/PublicFormViewer'
import { isMockMode } from '@/lib/config'
import { mockAdminTemplates } from '@/features/admin/template/repositories/template.mock.repository'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminTemplatePreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminTemplatePreviewPage({
  params,
}: AdminTemplatePreviewPageProps) {
  const { id } = await params
  const templateId = Number(id)

  if (!templateId || Number.isNaN(templateId)) {
    notFound()
  }

  let name = `Biểu mẫu #${templateId}`
  let description: string | null = null
  let schemaContent: FormSchemaJson | null = null

  if (isMockMode()) {
    const mockItem = mockAdminTemplates.find((t) => t.id === templateId)
    if (!mockItem) notFound()
    name = mockItem.title
    description = mockItem.description
  } else {
    const [row] = await db
      .select({
        id: template.id,
        name: template.name,
        description: template.description,
        schemaContent: schemaJson.content,
      })
      .from(template)
      .leftJoin(schemaJson, eq(template.schemaId, schemaJson.id))
      .where(eq(template.id, templateId))
      .limit(1)

    if (!row) {
      notFound()
    }

    name = row.name
    description = row.description
    schemaContent = (row.schemaContent as FormSchemaJson) ?? null

    if (schemaContent) {
      hydrateImageUrls(schemaContent)
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col -m-4 sm:-m-6 overflow-hidden">
      {/* Thanh điều hướng nhanh cho Admin */}
      <div className="bg-background border-b border-border px-4 py-2 flex items-center justify-between shrink-0">
        <Link href="/admin/templates">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs cursor-pointer">
            <ArrowLeft className="size-3.5" />
            <span>Quay lại danh sách</span>
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground font-mono">Biểu mẫu #{templateId}</span>
      </div>

      {/* Khung hiển thị biểu mẫu (tái sử dụng PublicFormViewer với canvas và bộ chọn trang dọc) */}
      <div className="flex-1 min-h-0 overflow-auto">
        <PublicFormViewer
          form={{
            id: templateId,
            name,
            description,
            schemaContent,
          }}
        />
      </div>
    </div>
  )
}
