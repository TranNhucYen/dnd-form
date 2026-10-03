import { NextRequest, NextResponse } from 'next/server';
import { templateRepository } from '@/features/templates/repositories';
import { pdfGeneratorService } from '@/lib/pdf/pdf-generator.service';
import { slugify } from '@/lib/slug';
import { toMm } from '@/features/form-builder/domain/units';
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const templateId = Number(id);

    if (!templateId || Number.isNaN(templateId)) {
      return NextResponse.json(
        { success: false, error: 'ID mẫu biểu mẫu không hợp lệ' },
        { status: 400 }
      );
    }

    // Lấy dữ liệu template và schema từ repository
    const templateData = await templateRepository.getTemplateById(templateId);

    if (!templateData || !templateData.schemaContent) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy mẫu biểu mẫu hoặc biểu mẫu chưa được kích hoạt' },
        { status: 404 }
      );
    }

    const schema = templateData.schemaContent as FormSchemaJson;

    // Kích thước khổ giấy (mm)
    const widthMm =
      schema?.page?.dimensions?.width && schema.page.dimensions.width > 0
        ? toMm(schema.page.dimensions.width)
        : 210;

    const heightMm =
      schema?.page?.dimensions?.height && schema.page.dimensions.height > 0
        ? toMm(schema.page.dimensions.height)
        : 297;

    // URL trang in nội bộ
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const printUrl = `${protocol}://${host}/print/templates/${templateId}`;

    // Kết xuất PDF bằng Puppeteer
    const pdfBuffer = await pdfGeneratorService.generatePdf({
      url: printUrl,
      widthMm,
      heightMm,
    });

    const filename = `${slugify(templateData.name) || 'mau-bieu-mau'}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('[API /api/templates/[id]/export-pdf] Lỗi xuất PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo file PDF',
      },
      { status: 500 }
    );
  }
}
