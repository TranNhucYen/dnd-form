"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Inbox,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput, EmptyState } from "@/shared/components";
import { useCollectionStats } from "../../hooks/useCollectionStats";
import { useExportSubmissionPdf } from "../../hooks/useExportSubmissionPdf";
import type { FormSubmissionItem } from "../../services/collect.service";
import { CollectingFormCombobox } from "./CollectingFormCombobox";
import { CollectionStatsOverview } from "./CollectionStatsOverview";
import { DeleteSubmissionDialog } from "./DeleteSubmissionDialog";
import { SubmissionDetailDialog } from "./SubmissionDetailDialog";
import { parseSubmissionFields } from "./submission-fields";
import { useCustomColumns } from "./useCustomColumns";
import { useSubmissionSort } from "./useSubmissionSort";

/**
 * Màn hình Thống kê thu thập phản hồi E-Form:
 * - Chọn biểu mẫu và theo dõi chỉ số tổng quan (Overview Cards)
 * - Xem bảng danh sách các bản nộp đã điền.
 * - Thêm/xóa/đổi các cột trường tùy chọn linh hoạt
 * - Sắp xếp cột STT, thời gian nộp và trường tùy chọn
 * - Xem tóm tắt, in trang in mẫu thật hoặc xuất file PDF
 */
export function CollectionStatsView() {
  const {
    forms,
    selectedFormId,
    selectedForm,
    config,
    isLoadingForms,
    isLoadingSubmissions,
    isToggling,
    deletingId,
    submissionSearch,
    setSubmissionSearch,
    filteredSubmissions,
    handleSelectForm,
    handleToggleCollection,
    handleDeleteSubmission,
    refetchSubmissions,
  } = useCollectionStats();

  const { isExporting: isDownloadingPdf, downloadSubmissionPdf } =
    useExportSubmissionPdf();

  // State thông báo chép link & các ID đang xử lý
  const [copied, setCopied] = useState(false);
  const [detailSubmission, setDetailSubmission] =
    useState<FormSubmissionItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Hook quản lý các cột trường tùy chọn do người dùng chọn hiển thị
  const {
    customColumns,
    availableFields,
    handleSelectCustomField,
    handleAddCustomColumn,
    handleRemoveOrClearCustomColumn,
  } = useCustomColumns(selectedFormId, config?.submissions);

  // Hook quản lý trạng thái và thuật toán sắp xếp (STT, thời gian, trường tùy chọn)
  const {
    sortState,
    sortedSubmissions,
    handleToggleSort,
    renderSortIcon,
  } = useSubmissionSort(filteredSubmissions);

  // Đường dẫn link nộp công khai của biểu mẫu
  let collectUrl: string | null = null;
  if (config?.collectToken) {
    if (typeof window !== "undefined") {
      collectUrl = `${window.location.origin}/collect/${config.collectToken}`;
    } else {
      collectUrl = `/collect/${config.collectToken}`;
    }
  }

  // Sao chép liên kết thu thập vào clipboard
  const handleCopyLink = async () => {
    if (!collectUrl) return;
    try {
      await navigator.clipboard.writeText(collectUrl);
      setCopied(true);
      toast.success("Đã sao chép liên kết thu thập!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể sao chép liên kết.");
    }
  };

  // Tải file PDF bản nộp cụ thể
  const handleDownloadSinglePdf = async (sub: FormSubmissionItem) => {
    setDownloadingId(sub.id);
    try {
      await downloadSubmissionPdf(sub.id, selectedForm?.name);
    } finally {
      setDownloadingId(null);
    }
  };

  // Ánh xạ STT gốc (bản nộp đầu tiên là 1, tiếp theo tăng dần)
  const submissionOrderMap = useMemo(() => {
    const map = new Map<number, number>();
    const all = config?.submissions || [];
    const total = all.length;
    all.forEach((item, idx) => {
      map.set(item.id, total - idx);
    });
    return map;
  }, [config?.submissions]);

  const latestSubmission = config?.submissions?.[0];

  // Mô tả khi bảng phản hồi rỗng (dùng if/else thay thế toán tử 3 ngôi lồng nhau)
  let emptyStateDescription = "Biểu mẫu này hiện đang tắt nhận phản hồi. Hãy bật thu thập để nhận câu trả lời.";
  if (submissionSearch) {
    emptyStateDescription = `Không có kết quả khớp với "${submissionSearch}". Hãy thử từ khóa khác.`;
  } else if (config?.isCollecting) {
    emptyStateDescription = "Biểu mẫu này đang mở nhận phản hồi nhưng chưa có ai nộp. Hãy gửi liên kết cho người điền!";
  }

  return (
    <div className="w-full mx-auto flex flex-col gap-5">
      {/* Thanh tiêu đề & Combobox chọn biểu mẫu*/}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border py-4 -mx-6 px-6 transition-all">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="size-6 text-primary" />
            <span>Thống kê thu thập</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Theo dõi số lượng phản hồi và quản lý các bản nộp E-Form của bạn.
          </p>
        </div>

        {/* Ô chọn biểu mẫu & Nút tải lại */}
        <div className="w-full md:w-auto flex items-center gap-2">
          {isLoadingForms ? (
            <Skeleton className="h-10 w-full sm:w-[360px] rounded-lg" />
          ) : (
            <CollectingFormCombobox
              forms={forms}
              selectedFormId={selectedFormId}
              onSelectForm={handleSelectForm}
            />
          )}

          {selectedFormId && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchSubmissions()}
              disabled={isLoadingSubmissions}
              className="shrink-0 size-10 cursor-pointer"
              title="Tải lại dữ liệu"
            >
              <RefreshCw
                className={`size-4 ${isLoadingSubmissions ? "animate-spin" : ""}`}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Trường hợp tài khoản chưa có biểu mẫu nào */}
      {!isLoadingForms && forms.length === 0 && (
        <EmptyState
          className="min-h-[300px] py-16"
          icon={FileSpreadsheet}
          title="Chưa có biểu mẫu nào"
          description="Bạn chưa tạo biểu mẫu nào để bắt đầu thu thập dữ liệu. Hãy tạo biểu mẫu đầu tiên của bạn!"
          action={
            <Link href="/my-form">
              <Button size="sm" className="cursor-pointer">
                Đến trang Biểu mẫu của tôi
              </Button>
            </Link>
          }
        />
      )}

      {/* Nội dung chính khi đã chọn một biểu mẫu */}
      {selectedForm && (
        <div className="flex flex-col gap-4">
          {/* Thẻ thống kê tổng quan (4 Card) */}
          <CollectionStatsOverview
            selectedForm={selectedForm}
            config={config}
            isToggling={isToggling}
            latestSubmission={latestSubmission}
            onToggleCollection={handleToggleCollection}
          />

          {/* Thanh tìm kiếm phản hồi trong bảng & Thao tác liên kết điền */}
          <div className="shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <SearchInput
              wrapperClassName="w-full sm:w-80"
              placeholder="Tìm kiếm nội dung phản hồi, thời gian..."
              value={submissionSearch}
              onChange={(e) => setSubmissionSearch(e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
              {collectUrl && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="h-8 text-xs gap-1.5 cursor-pointer"
                    title="Sao chép link điền"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 text-muted-foreground" />
                        <span>Link điền</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(collectUrl, "_blank")}
                    className="h-8 text-xs gap-1.5 cursor-pointer"
                    title="Mở trang điền trên tab mới"
                  >
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                    <span>Mở trang điền</span>
                  </Button>
                </>
              )}

              <span className="text-xs text-muted-foreground pl-1">
                Hiển thị:{" "}
                <strong className="font-semibold text-foreground">
                  {filteredSubmissions.length}
                </strong>{" "}
                / {config?.submissions?.length ?? 0} bản nộp
              </span>
            </div>
          </div>

          {/* Bảng danh sách các bản nộp */}
          {isLoadingSubmissions ? (
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-8 w-28" />
                </div>
              ))}
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <EmptyState
              className="min-h-[220px] py-12"
              icon={Inbox}
              title={submissionSearch ? "Không tìm thấy phản hồi phù hợp" : "Chưa có phản hồi nào"}
              description={emptyStateDescription}
              action={
                !submissionSearch && config?.isCollecting && collectUrl ? (
                  <Button
                    size="sm"
                    onClick={handleCopyLink}
                    className="text-xs cursor-pointer gap-1.5"
                  >
                    <Copy className="size-3.5" />
                    Sao chép link nộp
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      {/* Cột 1: STT (hỗ trợ sắp xếp) */}
                      <TableHead className="w-20 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleToggleSort("stt")}
                          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer select-none"
                          title="Sắp xếp theo STT"
                        >
                          <span>STT</span>
                          {renderSortIcon("stt")}
                        </button>
                      </TableHead>

                      {/* Cột 2: Thời gian nộp (hỗ trợ sắp xếp) */}
                      <TableHead className="w-48 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleToggleSort("createdAt")}
                          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer select-none"
                          title="Sắp xếp theo thời gian nộp"
                        >
                          <span>Thời gian nộp</span>
                          {renderSortIcon("createdAt")}
                        </button>
                      </TableHead>

                      {/* Cột 3: Các trường đã điền */}
                      <TableHead className="w-44 font-semibold">
                        Các trường đã điền
                      </TableHead>

                      {/* Các cột trường tùy chọn do người dùng chọn */}
                      {customColumns.map((col, colIdx) => (
                        <TableHead
                          key={col.id}
                          className="min-w-[200px] font-semibold py-2"
                        >
                          <div className="flex items-center gap-1.5">
                            {/* Ô Select chọn trường hiển thị */}
                            <Select
                              key={`${col.id}_${col.selectKey}`}
                              value={col.fieldId || undefined}
                              onValueChange={(val) =>
                                handleSelectCustomField(col.id, val)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs bg-background flex-1 min-w-[130px] font-normal cursor-pointer">
                                <SelectValue placeholder="Chọn trường..." />
                              </SelectTrigger>
                              <SelectContent
                                position="popper"
                                sideOffset={4}
                                align="start"
                                className="rounded-md"
                              >
                                {availableFields.length === 0 ? (
                                  <div className="p-2 text-xs text-muted-foreground text-center">
                                    Không có trường nào
                                  </div>
                                ) : (
                                  availableFields.map((f) => (
                                    <SelectItem
                                      key={f.id}
                                      value={f.id}
                                      className="text-xs cursor-pointer rounded-sm"
                                    >
                                      {f.label}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>

                            {/* Nút sắp xếp cho cột tùy chọn */}
                            {col.fieldId && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleSort(col.fieldId)}
                                className="size-7 cursor-pointer shrink-0 text-muted-foreground hover:text-foreground"
                                title="Sắp xếp theo trường này"
                              >
                                {renderSortIcon(col.fieldId)}
                              </Button>
                            )}

                            {/* Nút xóa / reset cột */}
                            {(col.fieldId || customColumns.length > 1) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveOrClearCustomColumn(col.id)
                                }
                                className="size-7 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                                title={col.fieldId ? "Xóa lựa chọn (trở về Chọn trường...)" : "Xóa cột này"}
                              >
                                <X className="size-3.5" />
                              </Button>
                            )}

                            {/* Nút + thêm cột mới ở cột cuối cùng */}
                            {colIdx === customColumns.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddCustomColumn}
                                className="size-7 cursor-pointer shrink-0 border-dashed hover:border-primary text-muted-foreground hover:text-primary"
                                title="Thêm một cột tùy chọn khác"
                              >
                                <Plus className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableHead>
                      ))}

                      {/* Cột Thao tác */}
                      <TableHead className="w-56 text-right font-semibold pr-4">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSubmissions.map((sub, index) => {
                      const orderNumber =
                        submissionOrderMap.get(sub.id) ?? index + 1;
                      const { totalCount, filledCount, fields } =
                        parseSubmissionFields(sub);
                      const isComplete =
                        totalCount > 0 && filledCount >= totalCount;

                      return (
                        <TableRow
                          key={sub.id}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          {/* Số thứ tự STT */}
                          <TableCell className="font-medium text-xs text-muted-foreground">
                            {orderNumber}
                          </TableCell>

                          {/* Thời gian nộp */}
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {sub.formattedCreatedAt}
                          </TableCell>

                          {/* Các trường đã điền kèm chấm xanh / vàng */}
                          <TableCell className="text-xs font-medium text-foreground whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`size-2 rounded-full shrink-0 ${isComplete ? "bg-emerald-500" : "bg-amber-500"}`}
                                title={isComplete ? "Đã điền đầy đủ" : "Chưa điền xong"}
                              />
                              <span>
                                {filledCount}/{totalCount} trường
                              </span>
                            </div>
                          </TableCell>

                          {/* Dữ liệu của các cột trường tùy chọn */}
                          {customColumns.map((col) => {
                            if (!col.fieldId) {
                              return (
                                <TableCell
                                  key={col.id}
                                  className="text-xs text-muted-foreground italic"
                                >
                                  —
                                </TableCell>
                              );
                            }

                            const field = fields.find(
                              (f) => f.id === col.fieldId,
                            );
                            if (!field || !field.isFilled) {
                              return (
                                <TableCell
                                  key={col.id}
                                  className="text-xs text-muted-foreground italic"
                                >
                                  (Trống)
                                </TableCell>
                              );
                            }

                            // Chữ ký hoặc bảng dữ liệu hiển thị màu xanh lá nhẹ
                            if (
                              field.type === "signature" ||
                              field.type === "datatable"
                            ) {
                              return (
                                <TableCell
                                  key={col.id}
                                  className="text-xs text-emerald-700 dark:text-emerald-400 font-medium whitespace-nowrap"
                                >
                                  {field.formattedValue}
                                </TableCell>
                              );
                            }

                            return (
                              <TableCell
                                key={col.id}
                                className="text-xs text-foreground font-medium max-w-[220px] truncate"
                                title={field.formattedValue}
                              >
                                {field.formattedValue}
                              </TableCell>
                            );
                          })}

                          {/* Các nút hành động trên dòng */}
                          <TableCell className="text-right pr-4">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Xem tóm tắt chi tiết */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setDetailSubmission(sub)}
                                className="h-8 px-2 text-xs gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                                title="Xem tóm tắt các trường đã điền"
                              >
                                <Eye className="size-3.5" />
                                <span className="hidden sm:inline">
                                  Chi tiết
                                </span>
                              </Button>

                              {/* Xem & In */}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `/print/submissions/${sub.id}`,
                                    "_blank",
                                  )
                                }
                                className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
                                title="Mở trang xem & in"
                              >
                                <Printer className="size-3.5 text-neutral-600" />
                                <span className="hidden sm:inline">
                                  Xem/In
                                </span>
                              </Button>

                              {/* Tải xuống PDF */}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadSinglePdf(sub)}
                                disabled={
                                  isDownloadingPdf && downloadingId === sub.id
                                }
                                className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
                                title="Tải xuống file PDF"
                              >
                                {isDownloadingPdf &&
                                downloadingId === sub.id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Download className="size-3.5 text-neutral-600" />
                                )}
                                <span className="hidden sm:inline">PDF</span>
                              </Button>

                              {/* Xóa bản ghi */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={deletingId === sub.id}
                                onClick={() => setConfirmDeleteId(sub.id)}
                                className="size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                                title="Xóa phản hồi này"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog xem tóm tắt các trường đã điền */}
      <SubmissionDetailDialog
        submission={detailSubmission}
        formName={selectedForm?.name}
        open={Boolean(detailSubmission)}
        onOpenChange={(open) => !open && setDetailSubmission(null)}
      />

      {/* Dialog xác nhận xóa bản ghi */}
      <DeleteSubmissionDialog
        submissionId={confirmDeleteId}
        open={Boolean(confirmDeleteId)}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={handleDeleteSubmission}
      />
    </div>
  );
}
