import type { EFormPage } from "../types/eform.types";
import { EFormRowRenderer } from "./EFormRowRenderer";

interface EFormPageRendererProps {
  page: EFormPage;
  totalPageCount: number;
  onValueChange?: (fieldId: string, value: unknown) => void;
}

export function EFormPageRenderer({
  page,
  totalPageCount,
  onValueChange,
}: EFormPageRendererProps) {
  return (
    <div className="flex w-full min-w-0 flex-col">
      {/* Hiển thị tiêu đề phân trang nếu biểu mẫu có nhiều trang */}
      {totalPageCount > 1 && (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-200 min-w-0">
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Trang {page.pageNumber} / {totalPageCount}
          </span>
          {page.name && page.name !== `Trang ${page.pageNumber}` && (
            <span className="text-xs font-medium text-neutral-500 truncate">
              {page.name}
            </span>
          )}
        </div>
      )}

      {/* Danh sách các hàng trường dữ liệu */}
      <div className="flex w-full min-w-0 flex-col gap-1">
        {page.rows.map((row) => (
          <EFormRowRenderer
            key={row.id}
            row={row}
            onValueChange={onValueChange}
          />
        ))}
      </div>
    </div>
  );
}
