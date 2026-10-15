"use client";

import { PdfBackgroundTool } from "../tools";

export function BackgroundTabContent() {
  return (
    <div className="flex items-center gap-2">
      {/* Nhóm công cụ: Tải lên PDF nền & chỉnh độ mờ */}
      <PdfBackgroundTool />
    </div>
  );
}

