import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { form, schemaJson } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { pdfGeneratorService } from '@/lib/pdf/pdf-generator.service'
import { slugify } from '@/lib/slug'
import { toMm } from '@/features/form-builder/domain/units'
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const formId = Number(id)

    if (!formId || Number.isNaN(formId)) {
      return NextResponse.json(
        { success: false, error: 'ID biểu mẫu không hợp lệ' },
        { status: 400 }
      )
    }

    const [formRecord] = await db
      .select({
        id: form.id,
        name: form.name,
        schemaContent: schemaJson.content,
      })
      .from(form)
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .where(eq(form.id, formId))

    if (!formRecord || !formRecord.schemaContent) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy biểu mẫu hoặc nội dung chưa được khởi tạo' },
        { status: 404 }
      )
    }

    const schema = formRecord.schemaContent as FormSchemaJson

    const firstPage = schema?.pages?.[0]

    // Kích thước khổ giấy (mm)
    const widthMm =
      firstPage?.page?.dimensions?.width && firstPage.page.dimensions.width > 0
        ? toMm(firstPage.page.dimensions.width)
        : 210

    const heightMm =
      firstPage?.page?.dimensions?.height && firstPage.page.dimensions.height > 0
        ? toMm(firstPage.page.dimensions.height)
        : 297

    // URL trang in nội bộ
    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const printUrl = `${protocol}://${host}/print/forms/${formId}`

    // Kết xuất PDF bằng Puppeteer
    const pdfBuffer = await pdfGeneratorService.generatePdf({
      url: printUrl,
      widthMm,
      heightMm,
    })

    const filename = `${slugify(formRecord.name) || 'bieu-mau'}.pdf`

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('[API /api/forms/[id]/export-pdf] Lỗi xuất PDF:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo file PDF',
      },
      { status: 500 }
    )
  }
}
