'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  XCircle,
} from 'lucide-react'
import { ContributionItem, ContributionStatus } from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'

interface ContributionFeedbackModalProps {
  item: ContributionItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContributionFeedbackModal({
  item,
  open,
  onOpenChange,
}: ContributionFeedbackModalProps) {
  if (!item) return null

  const isRejected = item.status === ContributionStatus.REJECTED
  const isApproved = item.status === ContributionStatus.APPROVED

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <div
              className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${isRejected
                ? 'bg-rose-100/80 text-rose-600'
                : isApproved
                  ? 'bg-emerald-100/80 text-emerald-600'
                  : 'bg-primary/10 text-primary'
                }`}
            >
              {isRejected ? (
                <AlertTriangle className="size-5" />
              ) : isApproved ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <MessageSquare className="size-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Chi tiết phản hồi từ Ban Quản trị
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Xem thông tin đánh giá và hướng dẫn điều chỉnh biểu mẫu cộng đồng
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Form Header Info */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <span className="font-semibold text-xs text-foreground truncate" title={item.title}>
                  {item.title}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 font-medium gap-1 ${isRejected
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : isApproved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
              >
                {isRejected && <XCircle className="size-3" />}
                {isApproved && <CheckCircle2 className="size-3" />}
                {!isRejected && !isApproved && <Clock className="size-3" />}
                {CONTRIBUTION_STATUS_LABELS[item.status]}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-2.5 border-t border-border/60">
              <span>Danh mục: <strong className="font-medium text-foreground">{item.categoryName}</strong></span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                Ngày gửi: {new Date(item.submittedAt).toLocaleDateString('vi-VN')}
              </span>
              {item.reviewedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  Ngày duyệt: {new Date(item.reviewedAt).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
          </div>

          {/* Feedback Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-muted-foreground" />
              Nội dung nhận xét & Góp ý:
            </label>

            {item.feedback ? (
              <div
                className={`p-3.5 rounded-lg border text-xs leading-relaxed whitespace-pre-wrap ${isRejected
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-muted/50 border-border text-foreground'
                  }`}
              >
                {item.feedback}
              </div>
            ) : (
              <div
                className="
                  p-4 rounded-lg border border-dashed border-border bg-muted/20 
                  text-center text-xs text-muted-foreground italic"
              >
                Chưa có ghi chú hoặc biểu mẫu đang trong hàng đợi kiểm duyệt.
              </div>
            )}
          </div>


        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
