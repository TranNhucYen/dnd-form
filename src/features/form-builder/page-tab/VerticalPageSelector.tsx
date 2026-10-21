"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useFormBuilderStore } from "../store/useFormBuilderStore";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const activeIndex = pages.findIndex((p) => p.id === activePageId);
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < pages.length - 1;
  const canDelete = !isReadOnly && pages.length > 1;

  const handleMouseEnter = (pageId: string) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredPageId(pageId);
  };

  const handleMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredPageId(null);
    }, 150);
  };

  // Cập nhật trạng thái chỉ báo cuộn
  const updateScrollIndicators = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setCanScrollUp(scrollTop > 4);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 4);
  }, []);

  // Tự động cuộn trang active vào khung nhìn khi activePageId thay đổi
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    const timeout = setTimeout(updateScrollIndicators, 150);
    return () => clearTimeout(timeout);
  }, [activePageId, updateScrollIndicators]);

  // Cập nhật chỉ báo khi danh sách trang thay đổi độ dài (thêm/xóa trang)
  useEffect(() => {
    updateScrollIndicators();
  }, [pages.length, updateScrollIndicators]);

  // Dọn dẹp timer khi unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

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
        "print:hidden z-20 flex flex-col items-center gap-1 select-none py-1",
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

      {/* Vùng chứa cuộn danh sách trang */}
      <div className="relative w-fit">
        {/* Chỉ báo mờ mép trên nếu danh sách còn tràn lên phía trên */}
        {canScrollUp && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-neutral-200/80 to-transparent z-10" />
        )}

        <div
          ref={containerRef}
          onScroll={updateScrollIndicators}
          onWheel={(e) => {
            // Chặn bubble sự kiện wheel để tránh ảnh hưởng CanvasViewPort
            e.stopPropagation();
          }}
          className={cn(
            "flex flex-col items-center gap-1.5 px-0.5 py-0.5",
            "max-h-[270px] overflow-y-auto overscroll-y-contain",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {pages.map((page, idx) => {
            const isActive = page.id === activePageId;
            const pageNum = page.pageNumber || idx + 1;
            const isHovered = hoveredPageId === page.id;

            return (
              <div
                key={page.id}
                ref={isActive ? activeItemRef : undefined}
                className="relative flex items-center justify-center"
              >
                {isActive && !isReadOnly ? (
                  <Popover open={isHovered}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setActivePageId(page.id)}
                        onMouseEnter={() => handleMouseEnter(page.id)}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                          "flex size-6 items-center justify-center rounded-[4px] text-[11px] font-bold transition-all cursor-pointer outline-none",
                          "bg-black text-white shadow-xs border-0",
                        )}
                        title={`Trang ${pageNum}`}
                        aria-label={`Trang ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      side="right"
                      sideOffset={6}
                      align="center"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      onMouseEnter={() => handleMouseEnter(page.id)}
                      onMouseLeave={handleMouseLeave}
                      className="flex w-auto items-center gap-0.5 rounded-[4px] bg-white px-1 py-0.5 shadow-md border border-neutral-200 z-50 p-0"
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
                    </PopoverContent>
                  </Popover>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>

        {/* Chỉ báo mờ mép dưới nếu danh sách còn tràn xuống phía dưới */}
        {canScrollDown && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-neutral-200/80 to-transparent z-10" />
        )}
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
