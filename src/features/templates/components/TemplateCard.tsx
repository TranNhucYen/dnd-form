import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Pencil, FileText } from "lucide-react"
import Link from "next/link"
import { Template, TemplatePricingType, TemplateStatus } from "../types/template.type"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const isPaid = template.pricingType === TemplatePricingType.PAID

  const renderStatusBadge = () => {
    switch (template.status) {
      case TemplateStatus.ACTIVE:
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0 font-medium"
          >
            Đang hoạt động
          </Badge>
        )
      case TemplateStatus.DRAFT:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 font-medium"
          >
            Bản nháp
          </Badge>
        )
      case TemplateStatus.ARCHIVED:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] px-1.5 py-0 font-medium"
          >
            Đã lưu trữ
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="
        flex flex-col justify-between gap-4 p-4 bg-white 
        border border-slate-200/80 rounded-xl shadow-xs 
        hover:shadow-md hover:border-slate-300 transition-all duration-200
      "
    >
      <Link href={`/templates/${template.id}`} className="flex gap-4 group/link cursor-pointer">
        {/* Left: Thumbnail Preview */}
        <div className="shrink-0 w-24">
          <AspectRatio
            ratio={210 / 297}
            className="
              border border-slate-200 rounded-lg 
              bg-slate-50 shadow-2xs overflow-hidden
              flex items-center justify-center text-slate-300
              group-hover/link:border-emerald-300 group-hover/link:bg-emerald-50/30 transition-all
            "
          >
            <FileText className="size-8 text-slate-300 group-hover/link:text-emerald-500 transition-colors" />
          </AspectRatio>
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {renderStatusBadge()}
            </div>

            <h2
              className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover/link:text-emerald-700 transition-colors"
              title={template.name}
            >
              {template.name}
            </h2>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={
                  isPaid
                    ? "bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold rounded-md"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100 text-xs font-semibold rounded-md"
                }
              >
                {isPaid ? "Trả phí" : "Miễn phí"}
              </Badge>
              <span className="text-[11px] text-slate-500 truncate font-medium">
                {template.categoryName}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Download className="size-3.5" />
              <span className="text-xs font-medium">
                {template.downloads.toLocaleString("vi-VN")} lượt tải
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5 cursor-pointer">
          <Download className="size-3.5" />
          Tải xuống
        </Button>
        <Link href={`/templates/${template.id}`} className="flex-1">
          <Button size="sm" className="w-full text-xs gap-1.5 cursor-pointer">
            <Pencil className="size-3.5" />
            Chi tiết
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function TemplateCardSkeleton() {
  return (
    <div
      className="
        flex flex-col justify-between gap-4 p-4 bg-white 
        border border-slate-200/80 rounded-xl shadow-xs 
      "
    >
      <div className="flex gap-4">
        {/* Left: Thumbnail Placeholder */}
        <div className="shrink-0 w-24">
          <AspectRatio
            ratio={210 / 297}
            className="
              border border-slate-200 rounded-lg 
              bg-slate-50 shadow-2xs overflow-hidden
            "
          >
            <Skeleton className="w-full h-full" />
          </AspectRatio>
        </div>

        {/* Right: Info Placeholder */}
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>

          <div className="flex flex-col gap-1.5 mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </div>
  )
}

