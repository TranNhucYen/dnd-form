import { notFound } from 'next/navigation'
import { db } from '@/db'
import { form, schemaJson } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { PrintCanvas } from '@/features/form-builder/print/PrintCanvas'
import { hydrateImageUrls } from '@/features/editor/utils/schema-hydrate'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

interface PrintFormPageProps {
  params: Promise<{ id: string }>
}

export default async function PrintFormPage({ params }: PrintFormPageProps) {
  const { id } = await params
  const formId = Number(id)

  if (!formId || Number.isNaN(formId)) {
    notFound()
  }

  const [record] = await db
    .select({
      id: form.id,
      name: form.name,
      schemaContent: schemaJson.content,
    })
    .from(form)
    .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
    .where(eq(form.id, formId))

  if (!record || !record.schemaContent) {
    notFound()
  }

  const schema = record.schemaContent as FormSchemaJson
  hydrateImageUrls(schema)

  return (
    <main className="w-full flex justify-center py-6 print:py-0">
      <PrintCanvas schema={schema} />
    </main>
  )
}
