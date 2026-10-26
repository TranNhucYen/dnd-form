import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { form, formSubmission } from '@/db/schema';
import { verifyJwtToken } from '@/lib/jwt';
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
    const submissionId = Number(id);

    if (!submissionId || Number.isNaN(submissionId)) {
      return NextResponse.json(
        { success: false, error: 'ID bản nộp không hợp lệ' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const user = token ? await verifyJwtToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập để tải bản nộp này' },
        { status: 401 }
      );
    }

    const [record] = await db
      .select({
        id: formSubmission.id,
        formName: form.name,
        filledSchema: formSubmission.filledSchema,
        createdAt: formSubmission.createdAt,
      })
      .from(formSubmission)
      .innerJoin(form, eq(formSubmission.formId, form.id))
      .where(
        and(eq(formSubmission.id, submissionId), eq(form.ownerId, user.id))
      );

    if (!record || !record.filledSchema) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy dữ liệu bản nộp hoặc bạn không có quyền truy cập' },
        { status: 404 }
      );
    }

    const schema = record.filledSchema as FormSchemaJson;
    const firstPage = schema?.pages?.[0];

    // Kích thước khổ giấy (mm)
    const widthMm =
      firstPage?.page?.dimensions?.width && firstPage.page.dimensions.width > 0
        ? toMm(firstPage.page.dimensions.width)
        : 210;

    const heightMm =
      firstPage?.page?.dimensions?.height && firstPage.page.dimensions.height > 0
        ? toMm(firstPage.page.dimensions.height)
        : 297;

    // URL trang in nội bộ
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const printUrl = `${protocol}://${host}/print/submissions/${submissionId}`;

    const cookieHeader = request.headers.get('cookie') || (token ? `auth_token=${token}` : undefined);

    // Kết xuất PDF bằng Puppeteer
    const pdfBuffer = await pdfGeneratorService.generatePdf({
      url: printUrl,
      widthMm,
      heightMm,
      cookieHeader,
    });

    const safeFormName = slugify(record.formName) || 'bieu-mau-da-dien';
    const filename = `${safeFormName}-ban-nop-${submissionId}.pdf`;

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
    console.error('[API /api/submissions/[id]/export-pdf] Lỗi xuất PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo file PDF',
      },
      { status: 500 }
    );
  }
}
