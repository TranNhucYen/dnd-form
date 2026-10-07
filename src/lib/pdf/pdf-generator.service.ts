import 'server-only';
import { getBrowserInstance } from './puppeteer-pool';
import { CSS_PX_PER_MM } from '@/features/form-builder/domain/units';

export interface GeneratePdfOptions {
  url: string;
  widthMm?: number;
  heightMm?: number;
  timeoutMs?: number;
}

/**
 * Service kết xuất file PDF từ URL trang in qua puppeteer
 */
export const pdfGeneratorService = {
  async generatePdf({
    url,
    widthMm,
    heightMm,
    timeoutMs = 30000,
  }: GeneratePdfOptions): Promise<Buffer> {
    const browser = await getBrowserInstance();
    const context = await browser.createBrowserContext();

    const wMm = widthMm || 210;
    const hMm = heightMm || 297;

    const viewportWidth = Math.max(100, Math.round(wMm * CSS_PX_PER_MM));
    const viewportHeight = Math.max(100, Math.round(hMm * CSS_PX_PER_MM));

    try {
      const page = await context.newPage();

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.error('[PUPPETEER PAGE ERROR]', msg.text());
        }
      });
      page.on('pageerror', (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[PUPPETEER UNCAUGHT ERROR]', message);
      });
      page.on('requestfailed', (req) => {
        console.warn('[PUPPETEER REQUEST FAILED]', req.url(), req.failure()?.errorText);
      });

      // Nhân 2 DPI
      await page.setViewport({
        width: viewportWidth,
        height: viewportHeight,
        deviceScaleFactor: 2,
      });

      // Giả lập media type print
      await page.emulateMediaType('print');

      // Điều hướng đến trang in
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: timeoutMs,
      });

      // Chờ trang in sẵn sàng (font, ảnh, TipTap)
      await page.waitForFunction(
        () => (window as unknown as { __DRAGFORM_RENDER_READY__?: boolean }).__DRAGFORM_RENDER_READY__ === true,
        { timeout: 15000 }
      );

      // Kết xuất PDF với kích thước mm chỉ định
      const pdfBytes = await page.pdf({
        width: `${wMm}mm`,
        height: `${hMm}mm`,
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
        displayHeaderFooter: false,
      });

      return Buffer.from(pdfBytes);
    } finally {
      try {
        await context.close();
      } catch {
        // Bỏ qua nếu context đã đóng
      }
    }
  },
};
