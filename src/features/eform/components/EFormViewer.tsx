import type { EFormLayout } from "../types/eform.types";
import { EFormPageRenderer } from "./EFormPageRenderer";

interface EFormViewerProps {
  layout: EFormLayout;
  title?: string;
  onValueChange?: (fieldId: string, value: unknown) => void;
}

export function EFormViewer({ layout, title, onValueChange }: EFormViewerProps) {
  if (!layout.pages || layout.pages.length === 0) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-400">
        Biểu mẫu chưa có trường dữ liệu nào để hiển thị E-Form.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-full overflow-x-hidden flex-col gap-6 md:gap-8 rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-6 md:p-8 shadow-xs">
      {/* Tiêu đề biểu mẫu E-Form */}
      {title && (
        <div className="pb-2 md:pb-4 text-center min-w-0">
          <h1 className="text-lg md:text-2xl font-bold tracking-tight text-neutral-900 break-words">
            {title}
          </h1>
        </div>
      )}

      {/* Danh sách các trang */}
      <div className="flex w-full min-w-0 flex-col gap-8 md:gap-10">
        {layout.pages.map((page, idx) => (
          <div key={page.id} className="flex w-full min-w-0 flex-col">
            <EFormPageRenderer
              page={page}
              totalPageCount={layout.pages.length}
              onValueChange={onValueChange}
            />
            {idx < layout.pages.length - 1 && (
              <div className="my-6 md:my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  Hết trang {page.pageNumber}
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
