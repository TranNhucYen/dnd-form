'use client'

import { useTranslation } from 'react-i18next'
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

  FolderPlus,

  MessageSquare,
} from 'lucide-react'
import { ContributionItem, ContributionStatus } from '../types/community.type'
import { CONTRIBUTION_STATUS_LABELS } from '../constants/community.constant'
import { EmptyState } from '@/shared/components'
import { formatDate } from '@/shared/utils'
import { ContributionFeedbackModal } from './ContributionFeedbackModal'

interface CommunityContributionsProps {
  contributions: ContributionItem[]
  onOpenContributeModal: () => void
}

export function CommunityContributions({
  contributions,
  onOpenContributeModal,
}: CommunityContributionsProps) {
  const { t } = useTranslation()
  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState<ContributionItem | null>(null)

  const approvedCount = contributions.filter((c) => c.status === ContributionStatus.APPROVED).length
  const pendingCount = contributions.filter((c) => c.status === ContributionStatus.PENDING).length

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
            <CardDescription className="text-xs">{t('community.generated.tongSoDongGop')}</CardDescription>
            <CardTitle className="text-2xl font-bold">{contributions.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {t('community.generated.cacBieuMauBanDaGuiLenCongDong')}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('community.generated.daDuocPheDuyet')}</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">
              {approvedCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {t('community.generated.dangCongKhaiVaChoPhepNguoiKhacSu')}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('community.generated.dangChoXetDuyet')}</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">
              {pendingCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {t('community.generated.banQuanTriDangXemXetTinhHopLe')}
          </CardContent>
        </Card>
      </div>

      {/* Contributions Table */}
      {contributions.length === 0 ? (
        <EmptyState
          icon={UploadCloud}
          title={t('community.generated.banChuaCoDongGopNao')}
          description={t('community.generated.hayChiaSeCacBieuMauHuuIchCua')}
          action={
            <Button
              size="sm"
              onClick={onOpenContributeModal}
              className="text-xs gap-1.5"
            >
              <FolderPlus className="size-3.5" />
              {t('community.generated.dongGopBieuMauNgay')}
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden border-border/80">
          <CardHeader className="py-4 px-5 border-b bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">{t('community.generated.lichSuDongGopBieuMau')}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {t('community.generated.theoDoiTienDoXetDuyetVaPhanHoi')}
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={onOpenContributeModal}
              className="text-xs gap-1.5 h-8"
            >
              <UploadCloud className="size-3.5" />
              {t('community.generated.guiBieuMauMoi')}
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-72">{t('community.generated.tenBieuMau')}</TableHead>
                  <TableHead className="w-32">{t('community.generated.danhMuc')}</TableHead>
                  <TableHead className="w-28">{t('community.generated.ngayGui')}</TableHead>
                  <TableHead className="w-36">{t('community.generated.trangThai')}</TableHead>
                  <TableHead className="w-44">{t('community.generated.phanHoiGhiChu')}</TableHead>
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
                      {formatDate(item.submittedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{renderStatusBadge(item.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {item.status === ContributionStatus.REJECTED && item.feedback ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFeedbackItem(item)}
                          title={t('community.generated.nhapDeXemChiTietLyDoTuChoi')}
                          className="
                            h-7 px-2.5 text-xs text-rose-700 bg-rose-50/70 border-rose-200 
                            hover:bg-rose-100 hover:text-rose-800 gap-1.5 cursor-pointer font-medium"
                        >
                          <MessageSquare className="size-3 text-rose-600 shrink-0" />
                          <span>{t('community.generated.xemLyDoTuChoi')}</span>
                        </Button>
                      ) : item.status === ContributionStatus.APPROVED ? (
                        <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="size-3.5 shrink-0" />
                          {t('community.generated.daPhatHanh')}{item.clonesCount || 0} {t('community.generated.luotDung')}
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
                          <span>{t('community.generated.xemGhiChu')}</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <Clock className="size-3 text-muted-foreground/70 shrink-0" />
                          {t('community.generated.dangChoKiemDuyet')}
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
