'use client'

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SearchInput, EmptyState, ErrorAlert } from "@/shared/components"
import { Card, CardSkeleton } from "./Card"
import { useTemplateList } from "../hooks/useTemplate"

export default function List() {
  const {
    templates,
    categories,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    loadMore,
    refetch,
  } = useTemplateList()

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    // observer chạy ngầm để theo dõi khi người dùng cuộn đến cuối danh sách rồi tự động tải thêm dữ liệu templates nếu còn
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)
    // giải phóng observer khi component re-render hoặc unmount
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Header section */}
      <div
        className="flex justify-between items-center w-full
        border-b border-border pb-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Các form mẫu</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Khám phá và sử dụng các mẫu biểu mẫu chuẩn có sẵn để bắt đầu nhanh chóng.
          </p>
        </div>
        <Link href="/editor">
          <Button className="cursor-pointer">
            <Plus data-icon="inline-start" />
            Tạo biểu mẫu mới
          </Button>
        </Link>
      </div>

      {/* Filter by Category and Search section */}
      <div
        className="flex flex-col md:flex-row gap-4 justify-between
        items-stretch md:items-center"
      >
        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full md:w-auto"
        >
          <TabsList className="flex flex-wrap h-auto md:h-9 bg-muted p-1 gap-0.5">
            <TabsTrigger value="all" className="text-xs cursor-pointer">
              Tất cả
            </TabsTrigger>
            {categories
              .filter((cat) => cat !== 'all')
              .map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs cursor-pointer"
                >
                  {cat}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>

        {/* Search input */}
        <SearchInput
          wrapperClassName="w-full md:w-72"
          placeholder="Tìm kiếm biểu mẫu theo tên hoặc mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error state */}
      <ErrorAlert error={error} onRetry={refetch} />

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && templates.length === 0 && (
        <EmptyState
          title="Không tìm thấy biểu mẫu phù hợp"
          description={
            searchTerm
              ? `Không có kết quả nào khớp với "${searchTerm}". Hãy thử từ khóa khác.`
              : "Hiện tại chưa có biểu mẫu nào trong danh mục này."
          }
        />
      )}

      {/* Templates grid */}
      {!isLoading && !error && templates.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} template={template} />
            ))}
            {/* Loading skeletons for infinite scroll */}
            {isFetchingMore &&
              Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={`fetching-more-${index}`} />
              ))}
          </div>

          {/* Sentinel element for infinite scroll */}
          {hasMore && <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />}

          {/* End of list message */}
          {!hasMore && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Đã hiển thị tất cả biểu mẫu.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export const TemplateList = List
