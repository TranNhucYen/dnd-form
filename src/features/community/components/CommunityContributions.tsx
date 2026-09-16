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
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FolderPlus,
  ArrowUpRight,
} from 'lucide-react'
import { ContributionItem, ContributionStatus } from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'

interface CommunityContributionsProps {
  contributions: ContributionItem[]
  onOpenContributeModal: () => void
}

export function CommunityContributions({
  contributions,
  onOpenContributeModal,
}: CommunityContributionsProps) {
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
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phản hồi / Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((item) => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
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
                    <TableCell className="text-muted-foreground">
                      {new Date(item.submittedAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell className="max-w-xs">
                      {item.status === ContributionStatus.REJECTED && item.feedback ? (
                        <div className="p-2 rounded bg-rose-50 text-rose-800 text-xs border border-rose-200/80 leading-relaxed">
                          <span className="font-semibold block mb-0.5">Lý do từ chối:</span>
                          {item.feedback}
                        </div>
                      ) : item.status === ContributionStatus.APPROVED ? (
                        <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="size-3.5" />
                          Đã phát hành ({item.clonesCount || 0} lượt dùng)
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Đang trong hàng đợi kiểm duyệt...
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
    </div>
  )
}
