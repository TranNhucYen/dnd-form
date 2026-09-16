'use client'

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
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useTemplateDetail } from "../hooks/useTemplate"
import { TemplatePricingType } from "../types/template.type"

interface TemplateDetailProps {
  id: string
}

export function TemplateDetail({ id }: TemplateDetailProps) {
  const { template, isLoading, error, refetch } = useTemplateDetail(Number(id))

  if (isLoading) {
    return <TemplateDetailSkeleton />
  }

  if (error || !template) {
    return (
      <div className="w-full mx-auto flex flex-col gap-6 py-12">
        <div>
          <Link href="/templates">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-800 gap-1.5 pl-2 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-red-50/50 border border-red-200 rounded-xl text-center">
          <AlertCircle className="size-12 text-red-500 mb-3" />
          <h2 className="text-lg font-bold text-slate-800">
            {error || "Không tìm thấy biểu mẫu"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
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
  const formattedDate = template.updatedAt
    ? new Date(template.updatedAt).toLocaleDateString("vi-VN")
    : "Chưa cập nhật"

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Back button */}
      <div>
        <Link href="/templates">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-800 gap-1.5 pl-2 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b border-slate-100 pb-6 gap-4">
        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {template.name}
            </h1>
            <Badge
              variant="outline"
              className={
                isPaid
                  ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold px-2.5 py-0.5 rounded-md"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold px-2.5 py-0.5 rounded-md"
              }
            >
              {isPaid ? "Trả phí" : "Miễn phí"}
            </Badge>
          </div>
          <span className="text-sm text-slate-500 font-medium">
            {template.downloads.toLocaleString("vi-VN")} lượt tải
          </span>
        </div>

        {/* Buttons Action */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none cursor-pointer gap-1.5">
            <Download className="size-4" />
            Tải xuống (PDF)
          </Button>
          <Link href="/editor" className="flex-1 md:flex-none">
            <Button className="w-full cursor-pointer gap-1.5">
              <Copy className="size-4" />
              Tạo bản sao chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      {/* Body Section (Ratio 2:3) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column (Ratio 2 / col-span-2) - Template Preview */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Xem trước biểu mẫu
          </h3>
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 shadow-sm overflow-hidden">
            <AspectRatio
              ratio={210 / 297}
              className="border border-slate-200 rounded-lg bg-white shadow-2xs overflow-hidden flex flex-col items-center justify-center text-slate-400 p-6 text-center"
            >
              <FileText className="size-16 text-slate-300 mb-3" />
              <p className="text-xs text-slate-400 font-medium max-w-xs">
                Xem trước trang mẫu chuẩn khổ giấy A4
              </p>
            </AspectRatio>
          </div>
        </div>

        {/* Right Column (Ratio 3 / col-span-3) - Info & Details */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* General introduction */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              Giới thiệu biểu mẫu
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {template.description || "Chưa có mô tả chi tiết cho biểu mẫu này."}
            </p>
          </div>

          <Separator />

          {/* Quick Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Tag className="size-5 text-slate-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Danh mục
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {template.categoryName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Calendar className="size-5 text-slate-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Cập nhật lần cuối
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <User className="size-5 text-slate-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Tác giả
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {template.ownerName}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-slate-800">
              Hướng dẫn điền biểu mẫu
            </h3>
            {template.guideline && template.guideline.length > 0 ? (
              <ol className="flex flex-col gap-3">
                {template.guideline.map((step, idx) => {
                  const content = typeof step === "string" ? step : step.content
                  return (
                    <li key={typeof step === "object" ? step.id : idx} className="flex gap-3 text-sm text-slate-600">
                      <span className="flex items-center justify-center size-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{content}</span>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Chưa có hướng dẫn cụ thể cho biểu mẫu này.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateDetailSkeleton() {
  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Back button placeholder */}
      <div>
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>

      {/* Header section placeholder */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b border-slate-100 pb-6 gap-4">
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
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4">
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

