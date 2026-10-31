"use client";

import Link from "next/link";
import {
  Calendar,
  Globe,
  Inbox,
  Loader2,
  Lock,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  CollectingFormSummary,
  FormCollectionConfig,
  FormSubmissionItem,
} from "../../services/collect.service";

export interface CollectionStatsOverviewProps {
  selectedForm: CollectingFormSummary;
  config: FormCollectionConfig | null;
  isToggling: boolean;
  latestSubmission?: FormSubmissionItem;
  onToggleCollection: () => void;
}

// Hiển thị thông tin tổng quan về thống kê thu thập của biểu mẫu
export function CollectionStatsOverview({
  selectedForm,
  config,
  isToggling,
  latestSubmission,
  onToggleCollection,
}: CollectionStatsOverviewProps) {
  const totalSubmissions = config?.submissions?.length ?? selectedForm.submissionsCount;

  // Nội dung nút Bật / Tắt thu thập (dùng if/else thay thế toán tử 3 ngôi lồng nhau)
  let toggleButtonContent: React.ReactNode = "Bật thu thập";
  if (isToggling) {
    toggleButtonContent = <Loader2 className="size-3.5 animate-spin" />;
  } else if (config?.isCollecting) {
    toggleButtonContent = "Tắt thu thập";
  }

  return (
    <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Tổng số phản hồi */}
      <Card className="p-3.5 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-xs text-muted-foreground truncate">
            Tổng số phản hồi
          </span>
          <span className="text-2xl font-bold text-foreground mt-0.5">
            {totalSubmissions}
          </span>
        </div>
        <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Inbox className="size-5" />
        </div>
      </Card>

      {/* Trạng thái thu thập */}
      <Card className="p-3.5 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-xs text-muted-foreground truncate">
            Trạng thái nhận
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {config?.isCollecting ? (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none text-[11px]">
                <Globe className="size-3 mr-1" />
                Đang nhận điền
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-[11px] text-muted-foreground"
              >
                <Lock className="size-3 mr-1" />
                Đang tạm tắt
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant={config?.isCollecting ? "outline" : "default"}
          size="sm"
          disabled={isToggling}
          onClick={onToggleCollection}
          className="h-8 text-xs cursor-pointer shrink-0"
        >
          {toggleButtonContent}
        </Button>
      </Card>

      {/* Phản hồi mới nhất */}
      <Card className="p-3.5 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-xs text-muted-foreground truncate">
            Phản hồi gần nhất
          </span>
          <span className="text-xs font-semibold text-foreground mt-1 truncate">
            {latestSubmission ? latestSubmission.formattedCreatedAt : "Chưa có"}
          </span>
        </div>
        <div className="size-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
          <Calendar className="size-5" />
        </div>
      </Card>

      {/* Thao tác nhanh Form */}
      <Card className="p-3.5 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-xs text-muted-foreground truncate">
            Thiết kế mẫu
          </span>
          <span
            className="text-xs font-medium text-foreground truncate mt-0.5"
            title={selectedForm.name}
          >
            {selectedForm.name}
          </span>
        </div>
        <Link href={`/editor?formId=${selectedForm.id}`} className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1 cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Sửa mẫu</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
