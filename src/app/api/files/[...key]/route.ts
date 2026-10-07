import { NextResponse, type NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getStorageConfig } from '@/lib/storage/storage.config';
import { resolveLocalPath } from '@/lib/storage/local.adapter';

export const runtime = 'nodejs';

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const config = getStorageConfig();
  if (config.driver !== 'local') return new NextResponse('Not Found', { status: 404 });

  const { key } = await params;
  if (!key || key.length === 0) return new NextResponse('Bad Request', { status: 400 });

  // Chỉ nhận đúng các định dạng ảnh cho phép
  const ext = path.extname(key[key.length - 1]).slice(1).toLowerCase();
  const contentType = MIME_MAP[ext];
  if (!contentType) return new NextResponse('Not Found', { status: 404 });

  const filePath = resolveLocalPath(config.localDir, key.join('/'));
  if (!filePath) return new NextResponse('Forbidden', { status: 403 });

  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': data.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return new NextResponse('Not Found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
