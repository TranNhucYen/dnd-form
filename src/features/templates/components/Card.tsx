import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Pencil, FileText } from "lucide-react"
import Link from "next/link"

import { formatNumber } from "@/shared/utils"
import { Template, TemplatePricingType } from "../types/template.type"

export interface CardProps {
  template: Template
}

export function Card({ template }: CardProps) {
  const isPaid = template.pricingType === TemplatePricingType.PAID

  return (
    <div
      className="
        flex flex-col justify-between gap-4 p-4 bg-card text-card-foreground 
        border border-border/80 rounded-lg shadow-xs 
        hover:shadow-md hover:border-border transition-all duration-200
      "
    >
      <Link href={`/templates/${template.id}`} className="flex gap-4 group/link cursor-pointer">
        {/* Left: Thumbnail Preview */}
        <div className="shrink-0 w-24">
          <AspectRatio
            ratio={210 / 297}
            className="
              border border-border rounded-md 
              bg-muted/50 shadow-2xs overflow-hidden
              flex items-center justify-center text-muted-foreground/40
              group-hover/link:border-foreground/30 group-hover/link:bg-muted transition-all
            "
          >
            <FileText className="size-8 text-muted-foreground/40 group-hover/link:text-foreground transition-colors" />
          </AspectRatio>
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex flex-col gap-1.5">
            <h2
              className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover/link:text-emerald-600 dark:group-hover/link:text-emerald-400 transition-colors"
              title={template.name}
            >
              {template.name}
            </h2>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={
                  isPaid
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-semibold rounded-md"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold rounded-md"
                }
              >
                {isPaid ? "Trả phí" : "Miễn phí"}
              </Badge>
              <span className="text-[11px] text-muted-foreground truncate font-medium">
                {template.categoryName}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Download className="size-3.5" />
              <span className="text-xs font-medium">
                {formatNumber(template.downloads)} lượt tải
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-1.5 cursor-pointer text-muted-foreground"
        >
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

export function CardSkeleton() {
  return (
    <div
      className="
        flex flex-col justify-between gap-4 p-4 bg-card 
        border border-border/80 rounded-lg shadow-xs 
      "
    >
      <div className="flex gap-4">
        {/* Left: Thumbnail Placeholder */}
        <div className="shrink-0 w-24">
          <AspectRatio
            ratio={210 / 297}
            className="
              border border-border rounded-md 
              bg-muted/50 shadow-2xs overflow-hidden
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

      <div className="flex gap-2 pt-2 border-t border-border">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </div>
  )
}

export const TemplateCard = Card
export const TemplateCardSkeleton = CardSkeleton
