"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FormSubmissionItem } from "../../services/collect.service";
import { parseSubmissionFields } from "./submission-fields";

export interface SubmissionDetailDialogProps {
  submission: FormSubmissionItem | null;
  formName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionDetailDialog({
  submission,
  formName,
  open,
  onOpenChange,
}: SubmissionDetailDialogProps) {
  const { totalCount, filledCount, fields } = useMemo(() => {
    return parseSubmissionFields(submission);
  }, [submission]);

  if (!submission) return null;

  // Chỉ hiển thị các trường đã được điền
  const filledFields = fields.filter((f) => f.isFilled);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-6">
        {/* Header: Tên biểu mẫu, thời gian nộp và tiến độ điền */}
        <DialogHeader className="space-y-1.5 pb-3 border-b border-border text-left">
          <DialogTitle className="text-lg font-bold text-foreground">
            {formName || "Biểu mẫu"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              Thời gian nộp:{" "}
              <strong className="text-foreground font-medium">
                {submission.formattedCreatedAt}
              </strong>
            </span>
            <span>•</span>
            <span>
              Số trường đã điền:{" "}
              <strong className="text-foreground font-medium">
                {filledCount}/{totalCount} trường
              </strong>
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Danh sách các dòng tóm tắt trường: **Tên trường**: Giá trị */}
        <ScrollArea className="flex-1 max-h-[55vh] pr-3 my-2">
          {filledFields.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center italic">
              Bản ghi này chưa có trường nào được điền.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 text-xs sm:text-sm py-1">
              {filledFields.map((field) => (
                <p key={field.id} className="leading-snug break-words">
                  <strong className="font-semibold text-foreground">
                    {field.label}:{" "}
                  </strong>
                  <span className="text-foreground">{field.formattedValue}</span>
                </p>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Nút đóng modal */}
        <DialogFooter className="border-t border-border pt-3 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-xs px-4"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
