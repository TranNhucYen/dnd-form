import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { and, eq, inArray } from 'drizzle-orm'
import { zipSync } from 'fflate'
import { db } from '@/db'
import { form, schemaJson } from '@/db/schema'
import { verifyJwtToken } from '@/lib/jwt'
import { pdfGeneratorService } from '@/lib/pdf/pdf-generator.service'
import { slugify } from '@/lib/slug'
import { toMm } from '@/features/form-builder/domain/units'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_FORM_EXPORT_COUNT = 30

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const user = token ? await verifyJwtToken(token) : null
    if (!user) {
      return NextResponse.json({ success: false, error: 'Bạn cần đăng nhập để tải biểu mẫu' }, { status: 401 })
    }

    const body: unknown = await request.json().catch(() => null)
    const requestedIds =
      typeof body === 'object' && body !== null && 'formIds' in body
        ? (body as { formIds?: unknown }).formIds
        : null

    if (
      !Array.isArray(requestedIds) ||
      requestedIds.length < 2 ||
      requestedIds.length > MAX_FORM_EXPORT_COUNT ||
      !requestedIds.every((id) => Number.isSafeInteger(id) && Number(id) > 0)
    ) {
      return NextResponse.json(
        { success: false, error: `Danh sách biểu mẫu không hợp lệ (chọn từ 2 đến ${MAX_FORM_EXPORT_COUNT} biểu mẫu)` },
        { status: 400 },
      )
    }

    const formIds = [...new Set(requestedIds as number[])]
    if (formIds.length < 2) {
      return NextResponse.json({ success: false, error: 'Cần chọn ít nhất hai biểu mẫu để tạo ZIP' }, { status: 400 })
    }

    const records = await db
      .select({ id: form.id, name: form.name, schemaContent: schemaJson.content })
      .from(form)
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .where(and(inArray(form.id, formIds), eq(form.ownerId, user.id)))

    if (records.length !== formIds.length || records.some((record) => !record.schemaContent)) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy một số biểu mẫu hoặc bạn không có quyền truy cập' },
        { status: 404 },
      )
    }

    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const cookieHeader = request.headers.get('cookie') || (token ? `auth_token=${token}` : undefined)
    const pdfFiles: Record<string, Uint8Array> = {}

    for (const record of records) {
      const schema = record.schemaContent as FormSchemaJson
      const firstPage = schema?.pages?.[0]
      const widthMm = firstPage?.page?.dimensions?.width && firstPage.page.dimensions.width > 0
        ? toMm(firstPage.page.dimensions.width)
        : 210
      const heightMm = firstPage?.page?.dimensions?.height && firstPage.page.dimensions.height > 0
        ? toMm(firstPage.page.dimensions.height)
        : 297
      const pdfBuffer = await pdfGeneratorService.generatePdf({
        url: `${protocol}://${host}/print/forms/${record.id}`,
        widthMm,
        heightMm,
        cookieHeader,
      })
      pdfFiles[`${slugify(record.name) || 'bieu-mau'}-${record.id}.pdf`] = pdfBuffer
    }

    const zipBuffer = zipSync(pdfFiles, { level: 0 })
    return new Response(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bieu-mau-pdf.zip"',
        'Content-Length': String(zipBuffer.length),
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('[API /api/forms/export-pdf-zip] Lỗi xuất ZIP:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo file ZIP' },
      { status: 500 },
    )
  }
}
