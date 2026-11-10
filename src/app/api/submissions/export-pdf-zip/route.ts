import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { and, eq, inArray } from 'drizzle-orm';
import { zipSync } from 'fflate';
import { db } from '@/db';
import { form, formSubmission } from '@/db/schema';
import { verifyJwtToken } from '@/lib/jwt';
import { pdfGeneratorService } from '@/lib/pdf/pdf-generator.service';
import { slugify } from '@/lib/slug';
import { toMm } from '@/features/form-builder/domain/units';
import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const user = token ? await verifyJwtToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập để tải bản nộp này' },
        { status: 401 },
      );
    }

    const body: unknown = await request.json().catch(() => null);
    const requestedIds =
      typeof body === 'object' && body !== null && 'submissionIds' in body
        ? (body as { submissionIds?: unknown }).submissionIds
        : null;

    if (
      !Array.isArray(requestedIds) ||
      requestedIds.length < 2 ||
      !requestedIds.every(
        (id) => Number.isSafeInteger(id) && Number(id) > 0,
      )
    ) {
      return NextResponse.json(
        { success: false, error: 'Danh sách bản nộp không hợp lệ' },
        { status: 400 },
      );
    }

    const submissionIds = [...new Set(requestedIds as number[])];
    if (submissionIds.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Cần chọn ít nhất hai bản nộp để tạo ZIP' },
        { status: 400 },
      );
    }

    const records = await db
      .select({
        id: formSubmission.id,
        formName: form.name,
        filledSchema: formSubmission.filledSchema,
      })
      .from(formSubmission)
      .innerJoin(form, eq(formSubmission.formId, form.id))
      .where(
        and(
          inArray(formSubmission.id, submissionIds),
          eq(form.ownerId, user.id),
        ),
      );

    if (
      records.length !== submissionIds.length ||
      records.some((record) => !record.filledSchema)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy một số bản nộp hoặc bạn không có quyền truy cập',
        },
        { status: 404 },
      );
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const cookieHeader = request.headers.get('cookie') || (token ? `auth_token=${token}` : undefined);
    const pdfFiles: Record<string, Uint8Array> = {};

    // Giữ thứ tự tuần tự để Puppeteer hoàn tất từng bản nộp trước khi bắt đầu bản tiếp theo.
    for (const record of records) {
      const schema = record.filledSchema as FormSchemaJson;
      const firstPage = schema?.pages?.[0];
      const widthMm =
        firstPage?.page?.dimensions?.width && firstPage.page.dimensions.width > 0
          ? toMm(firstPage.page.dimensions.width)
          : 210;
      const heightMm =
        firstPage?.page?.dimensions?.height && firstPage.page.dimensions.height > 0
          ? toMm(firstPage.page.dimensions.height)
          : 297;
      const printUrl = `${protocol}://${host}/print/submissions/${record.id}`;
      const pdfBuffer = await pdfGeneratorService.generatePdf({
        url: printUrl,
        widthMm,
        heightMm,
        cookieHeader,
      });
      const safeFormName = slugify(record.formName) || 'bieu-mau-da-dien';
      pdfFiles[`${safeFormName}-ban-nop-${record.id}.pdf`] = pdfBuffer;
    }

    const zipBuffer = zipSync(pdfFiles, { level: 0 });
    const safeFormName = slugify(records[0].formName) || 'ban-nop';

    return new Response(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeFormName}-pdf.zip"`,
        'Content-Length': String(zipBuffer.length),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('[API /api/submissions/export-pdf-zip] Lỗi xuất ZIP:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo file ZIP',
      },
      { status: 500 },
    );
  }
}
