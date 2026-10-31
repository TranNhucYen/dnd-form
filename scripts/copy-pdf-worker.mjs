import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

try {
  const pdfjsPkgPath = require.resolve("pdfjs-dist/package.json");
  const pdfjsDir = path.dirname(pdfjsPkgPath);
  const src = path.join(pdfjsDir, "build", "pdf.worker.min.mjs");

  const destDir = path.join(process.cwd(), "public");
  const dest = path.join(destDir, "pdf.worker.min.mjs");

  if (!fs.existsSync(src)) {
    console.warn(`[copy-pdf-worker] Không tìm thấy file nguồn: ${src}`);
    process.exit(0);
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  console.log("✓ [copy-pdf-worker] Đã copy pdf.worker.min.mjs vào thư mục public/");
} catch (error) {
  console.error("[copy-pdf-worker] Lỗi khi copy pdf worker:", error);
}
