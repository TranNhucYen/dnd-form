"use client";

import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useFormBuilderStore } from "../store/useFormBuilderStore";
import { cn } from "@/lib/utils";

interface VerticalPageSelectorProps {
  className?: string;
}

export function VerticalPageSelector({ className }: VerticalPageSelectorProps) {
  const pages = useFormBuilderStore((state) => state.pages);
  const activePageId = useFormBuilderStore((state) => state.activePageId);
  const setActivePageId = useFormBuilderStore((state) => state.setActivePageId);
  const addPage = useFormBuilderStore((state) => state.addPage);
  const removePage = useFormBuilderStore((state) => state.removePage);
  const isReadOnly = useFormBuilderStore((state) => state.isReadOnly);

  const activeIndex = pages.findIndex((p) => p.id === activePageId);
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < pages.length - 1;
  const canDelete = !isReadOnly && pages.length > 1;

  const handlePrevPage = () => {
    if (canGoPrev) {
      setActivePageId(pages[activeIndex - 1].id);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setActivePageId(pages[activeIndex + 1].id);
    }
  };

  return (
    <div
      className={cn(
        "z-20 flex flex-col items-center gap-1 select-none py-1",
        className,
      )}
    >
      {/* Mũi tên di chuyển active page lên trên */}
      <button
        type="button"
        onClick={handlePrevPage}
        disabled={!canGoPrev}
        className={cn(
          "flex size-6 items-center justify-center rounded-[4px] text-neutral-500 transition-colors cursor-pointer",
          "hover:bg-neutral-200 hover:text-black",
          "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-500",
        )}
        title="Trang trước"
        aria-label="Chuyển đến trang trước"
      >
        <ChevronUp className="size-3.5" />
      </button>

      {/* Danh sách các item hình vuông chỉ số trang */}
      <div className="flex flex-col items-center gap-1.5">
        {pages.map((page, idx) => {
          const isActive = page.id === activePageId;
          const pageNum = page.pageNumber || idx + 1;

          return (
            <div
              key={page.id}
              className="group/page relative flex items-center justify-center after:absolute after:-right-3 after:top-0 after:bottom-0 after:w-3"
            >
              {/* Item hình vuông chỉ số trang: nhỏ gọn, không outline, active đen chữ trắng, không active trắng chữ đen */}
              <button
                type="button"
                onClick={() => setActivePageId(page.id)}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] text-[11px] transition-all cursor-pointer outline-none",
                  isActive
                    ? "bg-black text-white font-bold shadow-xs border-0"
                    : "bg-white text-black border border-neutral-300 shadow-2xs hover:bg-neutral-100 hover:border-neutral-400",
                )}
                title={`Trang ${pageNum}`}
                aria-label={`Trang ${pageNum}`}
              >
                {pageNum}
              </button>

              {/* Khi VỪA Ở TRẠNG THÁI ACTIVE VỪA ĐƯỢC HOVER thì xuất hiện 2 biểu tượng insert và xóa */}
              {isActive && !isReadOnly && (
                <div
                  className={cn(
                    "absolute left-full ml-1.5 flex items-center gap-0.5 rounded-[4px] bg-white px-1 py-0.5 shadow-md border border-neutral-200 z-30",
                    "opacity-0 pointer-events-none group-hover/page:opacity-100 group-hover/page:pointer-events-auto transition-all duration-150",
                  )}
                >
                  {/* Biểu tượng Insert (Thêm trang) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addPage();
                    }}
                    className="flex size-5 items-center justify-center rounded-[3px] text-neutral-600 hover:bg-neutral-100 hover:text-primary transition-colors cursor-pointer"
                    title="Chèn thêm trang"
                    aria-label="Chèn thêm trang"
                  >
                    <Plus className="size-3" />
                  </button>

                  {/* Biểu tượng Xóa (Xóa trang) */}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePage(page.id);
                      }}
                      className="flex size-5 items-center justify-center rounded-[3px] text-neutral-600 hover:bg-destructive/15 hover:text-destructive transition-colors cursor-pointer"
                      title="Xóa trang này"
                      aria-label="Xóa trang này"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mũi tên di chuyển active page xuống dưới */}
      <button
        type="button"
        onClick={handleNextPage}
        disabled={!canGoNext}
        className={cn(
          "flex size-6 items-center justify-center rounded-[4px] text-neutral-500 transition-colors cursor-pointer",
          "hover:bg-neutral-200 hover:text-black",
          "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-500",
        )}
        title="Trang tiếp theo"
        aria-label="Chuyển đến trang tiếp theo"
      >
        <ChevronDown className="size-3.5" />
      </button>
    </div>
  );
}
