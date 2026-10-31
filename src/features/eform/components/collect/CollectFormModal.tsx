"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  Globe,
  Inbox,
  Link2,
  Loader2,
  Lock,
  Printer,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  deleteFormSubmissionAction,
  getFormCollectionConfigAction,
  toggleFormCollectionAction,
} from "../../actions/collect.action";
import type { FormSubmissionItem } from "../../services/collect.service";

interface CollectFormModalProps {
  formId: number | null;
  formName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollectFormModal({
  formId,
  formName,
  open,
  onOpenChange,
}: CollectFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectToken, setCollectToken] = useState<string | null>(null);
  const [resolvedName, setResolvedName] = useState(formName || "");
  const [submissions, setSubmissions] = useState<FormSubmissionItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadConfig = useCallback(async () => {
    if (!formId) return;
    setIsLoading(true);
    try {
      const res = await getFormCollectionConfigAction(formId);
      if (!res.success || !res.data) {
        toast.error(res.error || "Không thể tải cấu hình thu thập.");
        return;
      }
      setIsCollecting(res.data.isCollecting);
      setCollectToken(res.data.collectToken);
      setResolvedName(res.data.formName);
      setSubmissions(res.data.submissions);
    } catch {
      toast.error("Lỗi khi tải dữ liệu thu thập.");
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    if (open && formId) {
      loadConfig();
    }
  }, [open, formId, loadConfig]);

  if (!formId) return null;

  const collectUrl =
    typeof window !== "undefined" && collectToken
      ? `${window.location.origin}/collect/${collectToken}`
      : collectToken
        ? `/collect/${collectToken}`
        : "Bật thu thập để tạo liên kết công khai";

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const nextState = !isCollecting;
      const res = await toggleFormCollectionAction(formId, nextState);
      if (!res.success || !res.data) {
        toast.error(res.error || "Không thể cập nhật trạng thái thu thập.");
        return;
      }
      setIsCollecting(res.data.isCollecting);
      setCollectToken(res.data.collectToken);
      toast.success(
        res.data.isCollecting
          ? "Đã bật nhận điền biểu mẫu"
          : "Đã tắt nhận điền biểu mẫu",
      );
    } catch {
      toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleCopyLink = async () => {
    if (!isCollecting || !collectToken) return;
    try {
      await navigator.clipboard.writeText(collectUrl);
      setCopied(true);
      toast.success("Đã sao chép liên kết!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể sao chép liên kết.");
    }
  };

  const handleDeleteSubmission = async (submissionId: number) => {
    if (deletingId) return;
    setDeletingId(submissionId);
    try {
      const res = await deleteFormSubmissionAction(formId, submissionId);
      if (!res.success) {
        toast.error(res.error || "Không thể xóa bản ghi này.");
        return;
      }
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
      toast.success("Đã xóa bản điền.");
    } catch {
      toast.error("Lỗi khi xóa bản điền.");
    } finally {
      setDeletingId(null);
    }
  };

  const displayTitle = resolvedName || formName || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Inbox className="size-5 text-foreground" />
            Thu thập qua E-Form
          </DialogTitle>
          <DialogDescription className="truncate" title={displayTitle}>
            Biểu mẫu:{" "}
            <span className="font-semibold text-foreground">{displayTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-2 min-w-0 w-full overflow-hidden">
            {/* Public link section — đồng bộ cấu trúc với ShareFormModal */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border flex flex-col gap-3 min-w-0 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`size-8 rounded-md flex items-center justify-center ${
                      isCollecting
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCollecting ? (
                      <Globe className="size-4" />
                    ) : (
                      <Lock className="size-4" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      Nhận phản hồi bằng liên kết
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isCollecting
                        ? "Bất kỳ ai có liên kết đều có thể điền biểu mẫu này"
                        : "Hiện đang ngừng nhận điền biểu mẫu"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isCollecting ? "default" : "outline"}
                  size="sm"
                  disabled={isToggling}
                  onClick={handleToggle}
                  className="text-xs h-8 cursor-pointer"
                >
                  {isCollecting ? "Đang bật" : "Đang tắt"}
                </Button>
              </div>

              <div className="flex gap-2 items-center pt-1 min-w-0 w-full">
                <div className="min-w-0 flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground overflow-hidden">
                  <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <span
                    className="w-0 flex-1 truncate select-all font-mono"
                    title={collectUrl}
                  >
                    {collectUrl}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyLink}
                  disabled={!isCollecting || !collectToken}
                  className="text-xs h-8 shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check
                        data-icon="inline-start"
                        className="text-emerald-600"
                      />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy data-icon="inline-start" />
                      <span>Sao chép link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Submissions List — đồng bộ cấu trúc với ShareFormModal */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Danh sách đã điền ({submissions.length})
              </span>

              <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-1">
                {submissions.map((sub, index) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/40 text-xs"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-foreground truncate">
                        Bản điền #{submissions.length - index}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {sub.formattedCreatedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/print/submissions/${sub.id}`, "_blank")
                        }
                        className="h-7 text-[11px] gap-1.5 cursor-pointer"
                      >
                        <Printer className="size-3.5" />
                        <span>xem & tải xuống</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === sub.id}
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        {deletingId === sub.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}

                {submissions.length === 0 && (
                  <p className="text-xs text-muted-foreground italic py-2 text-center">
                    Chưa có bản điền nào được gửi về.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
