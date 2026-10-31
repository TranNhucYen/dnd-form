'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Download,
  Copy,
  Calendar,
  User,
  Tag,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useTemplateDetail } from "../hooks/useTemplate"
import { useExportTemplatePdf } from "../hooks/useExportTemplatePdf"
import { TemplatePricingType } from "../types/template.type"
import { TemplateCanvasPreview, TemplateZoomModal } from "./preview"
import { formatDate, formatNumber } from "@/shared/utils"

export interface DetailProps {
  id: string
}

export function Detail({ id }: DetailProps) {
  const { template, isLoading, isCopying, error, createFormCopy, refetch } = useTemplateDetail(Number(id))
  const { isExporting, downloadPdf } = useExportTemplatePdf()
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error || !template) {
    return (
      <div className="w-full mx-auto flex flex-col gap-6 py-12">
        <div>
          <Link href="/templates">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5 pl-2 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
          <AlertCircle className="size-12 text-destructive mb-3" />
          <h2 className="text-lg font-bold text-destructive">
            {error || "Không tìm thấy biểu mẫu"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Biểu mẫu bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không hợp lệ.
          </p>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="gap-1.5 cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              Thử lại
            </Button>
            <Link href="/templates">
              <Button size="sm" className="cursor-pointer">
                Xem tất cả biểu mẫu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isPaid = template.pricingType === TemplatePricingType.PAID
  const formattedDate = formatDate(template.updatedAt, undefined, "Chưa cập nhật")

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Back button */}
      <div>
        <Link href="/templates">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-1.5 pl-2 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b border-border pb-6 gap-4">
        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {template.name}
            </h1>
            <Badge
              variant="outline"
              className={
                isPaid
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold px-2.5 py-0.5 rounded-md"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold px-2.5 py-0.5 rounded-md"
              }
            >
              {isPaid ? "Trả phí" : "Miễn phí"}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {formatNumber(template.downloads)} lượt tải
          </span>
        </div>

        {/* Buttons Action */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => template && downloadPdf(template.id, template.name)}
            disabled={isExporting}
            className="flex-1 md:flex-none cursor-pointer gap-1.5 text-muted-foreground"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin text-neutral-500" />
            ) : (
              <Download className="size-4" />
            )}
            <span>{isExporting ? "Đang tạo PDF..." : "Tải xuống (PDF)"}</span>
          </Button>
          <Button
            onClick={createFormCopy}
            disabled={isCopying}
            className="flex-1 md:flex-none cursor-pointer gap-1.5"
          >
            {isCopying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Copy className="size-4" />
            )}
            {isCopying ? "Đang tạo bản sao..." : "Tạo bản sao chỉnh sửa"}
          </Button>
        </div>
      </div>

      {/* Body Section (Ratio 2:3) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column (Ratio 2 / col-span-2) - Template Preview */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Xem trước biểu mẫu
            </h3>
            {template.schemaContent?.pages && template.schemaContent.pages.length > 1 && (
              <Badge variant="outline" className="text-[11px] font-normal">
                {template.schemaContent.pages.length} trang
              </Badge>
            )}
          </div>
          <div
            className="border border-border rounded-lg bg-muted/30 p-4 shadow-xs overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setIsZoomOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsZoomOpen(true)
              }
            }}
          >
            <TemplateCanvasPreview
              schema={template.schemaContent}
              onZoomClick={() => setIsZoomOpen(true)}
            />
          </div>
        </div>

        {/* Right Column (Ratio 3 / col-span-3) - Info & Details */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* General introduction */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-foreground">
              Giới thiệu biểu mẫu
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {template.description || "Chưa có mô tả chi tiết cho biểu mẫu này."}
            </p>
          </div>

          <Separator />

          {/* Quick Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
              <Tag className="size-5 text-muted-foreground/70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Danh mục
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {template.categoryName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
              <Calendar className="size-5 text-muted-foreground/70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Cập nhật lần cuối
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
              <User className="size-5 text-muted-foreground/70 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Tác giả
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {template.ownerName}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-foreground">
              Hướng dẫn điền biểu mẫu
            </h3>
            {template.guideline && template.guideline.length > 0 ? (
              <ol className="flex flex-col gap-3">
                {template.guideline.map((step, idx) => {
                  const content = typeof step === "string" ? step : step.content
                  return (
                    <li key={typeof step === "object" ? step.id : idx} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center justify-center size-5 rounded-full bg-muted text-foreground text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{content}</span>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Chưa có hướng dẫn cụ thể cho biểu mẫu này.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal phóng to xem chi tiết */}
      <TemplateZoomModal
        open={isZoomOpen}
        onOpenChange={setIsZoomOpen}
        templateName={template.name}
        schema={template.schemaContent}
        onUseTemplate={createFormCopy}
        isCopying={isCopying}
      />
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Back button placeholder */}
      <div>
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>

      {/* Header section placeholder */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b border-border pb-6 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-44 rounded-md" />
        </div>
      </div>

      {/* Body section placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <Skeleton className="h-5 w-40 rounded" />
          <div className="border border-border rounded-lg bg-muted/30 p-4">
            <AspectRatio ratio={210 / 297} className="rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-52 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const TemplateDetail = Detail
export const TemplateDetailSkeleton = DetailSkeleton
