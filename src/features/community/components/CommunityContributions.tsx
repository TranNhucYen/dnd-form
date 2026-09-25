'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FolderPlus,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react'
import { ContributionItem, ContributionStatus } from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'
import { ContributionFeedbackModal } from './ContributionFeedbackModal'

interface CommunityContributionsProps {
  contributions: ContributionItem[]
  onOpenContributeModal: () => void
}

export function CommunityContributions({
  contributions,
  onOpenContributeModal,
}: CommunityContributionsProps) {
  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState<ContributionItem | null>(null)

  const approvedCount = contributions.filter(
    (c) => c.status === ContributionStatus.APPROVED
  ).length
  const pendingCount = contributions.filter(
    (c) => c.status === ContributionStatus.PENDING
  ).length
  const rejectedCount = contributions.filter(
    (c) => c.status === ContributionStatus.REJECTED
  ).length

  const renderStatusBadge = (status: ContributionStatus) => {
    switch (status) {
      case ContributionStatus.APPROVED:
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1"
          >
            <CheckCircle2 className="size-3" />
            {CONTRIBUTION_STATUS_LABELS[status]}
          </Badge>
        )
      case ContributionStatus.PENDING:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1"
          >
            <Clock className="size-3" />
            {CONTRIBUTION_STATUS_LABELS[status]}
          </Badge>
        )
      case ContributionStatus.REJECTED:
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-medium gap-1"
          >
            <XCircle className="size-3" />
            {CONTRIBUTION_STATUS_LABELS[status]}
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Tổng số đóng góp</CardDescription>
            <CardTitle className="text-2xl font-bold">{contributions.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Các biểu mẫu bạn đã gửi lên cộng đồng
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Đã được phê duyệt</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">
              {approvedCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Đang công khai và cho phép người khác sử dụng
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Đang chờ xét duyệt</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">
              {pendingCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Ban quản trị đang xem xét tính hợp lệ
          </CardContent>
        </Card>
      </div>

      {/* Contributions Table */}
      {contributions.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center border border-dashed rounded-xl bg-card">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <UploadCloud className="size-6" />
          </div>
          <h3 className="font-semibold text-sm">Bạn chưa có đóng góp nào</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Hãy chia sẻ các biểu mẫu hữu ích của bạn để giúp đỡ cộng đồng và lan tỏa giá trị!
          </p>
          <Button
            size="sm"
            onClick={onOpenContributeModal}
            className="mt-4 text-xs gap-1.5"
          >
            <FolderPlus className="size-3.5" />
            Đóng góp biểu mẫu ngay
          </Button>
        </div>
      ) : (
        <Card className="overflow-hidden border-border/80">
          <CardHeader className="py-4 px-5 border-b bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Lịch sử đóng góp biểu mẫu</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Theo dõi tiến độ xét duyệt và phản hồi từ ban quản trị
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={onOpenContributeModal}
              className="text-xs gap-1.5 h-8"
            >
              <UploadCloud className="size-3.5" />
              Gửi biểu mẫu mới
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-72">Tên biểu mẫu</TableHead>
                  <TableHead className="w-32">Danh mục</TableHead>
                  <TableHead className="w-28">Ngày gửi</TableHead>
                  <TableHead className="w-36">Trạng thái</TableHead>
                  <TableHead className="w-44">Phản hồi / Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((item) => (
                  <TableRow key={item.id} className="text-xs hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium max-w-72">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground truncate block" title={item.title}>
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5" title={item.description}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {item.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(item.submittedAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{renderStatusBadge(item.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {item.status === ContributionStatus.REJECTED && item.feedback ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFeedbackItem(item)}
                          title="Nhấp để xem chi tiết lý do từ chối"
                          className="
                            h-7 px-2.5 text-xs text-rose-700 bg-rose-50/70 border-rose-200 
                            hover:bg-rose-100 hover:text-rose-800 gap-1.5 cursor-pointer font-medium"
                        >
                          <MessageSquare className="size-3 text-rose-600 shrink-0" />
                          <span>Xem lý do từ chối</span>
                        </Button>
                      ) : item.status === ContributionStatus.APPROVED ? (
                        <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="size-3.5 shrink-0" />
                          Đã phát hành ({item.clonesCount || 0} lượt dùng)
                        </span>
                      ) : item.feedback ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFeedbackItem(item)}
                          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="size-3 shrink-0" />
                          <span>Xem ghi chú</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <Clock className="size-3 text-muted-foreground/70 shrink-0" />
                          Đang chờ kiểm duyệt...
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Contribution Feedback Detail Modal */}
      <ContributionFeedbackModal
        item={selectedFeedbackItem}
        open={!!selectedFeedbackItem}
        onOpenChange={(open) => !open && setSelectedFeedbackItem(null)}
      />
    </div>
  )
}
