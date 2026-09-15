'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, RefreshCw, AlertCircle, FileQuestion } from "lucide-react"
import Link from "next/link"
import { TemplateCard, TemplateCardSkeleton } from "./TemplateCard"
import { useTemplateList } from "../hooks/useTemplate"

export default function TemplateList() {
  const {
    templates,
    categories,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    refetch,
  } = useTemplateList()

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
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2
            size-4 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm biểu mẫu theo tên hoặc mô tả..."
            className="pl-9 h-9 text-xs focus-visible:ring-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle />
            <div>
              <AlertTitle>Đã có lỗi xảy ra</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="cursor-pointer text-xs shrink-0"
          >
            <RefreshCw data-icon="inline-start" />
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && templates.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 px-4
          border border-dashed border-border rounded-xl bg-muted/20 text-center"
        >
          <FileQuestion className="size-12 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">
            Không tìm thấy biểu mẫu phù hợp
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchTerm
              ? `Không có kết quả nào khớp với "${searchTerm}". Hãy thử từ khóa khác.`
              : "Hiện tại chưa có biểu mẫu nào trong danh mục này."}
          </p>
        </div>
      )}

      {/* Templates grid */}
      {!isLoading && !error && templates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}