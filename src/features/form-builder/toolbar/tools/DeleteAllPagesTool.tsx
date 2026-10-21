"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function DeleteAllPagesTool() {
  const [isOpen, setIsOpen] = useState(false);

  const pages = useFormBuilderStore((state) => state.pages);
  const backgroundPdf = useFormBuilderStore((state) => state.backgroundPdf);
  const isReadOnly = useFormBuilderStore((state) => state.isReadOnly);
  const clearAllPages = useFormBuilderStore((state) => state.clearAllPages);

  const hasContent =
    pages.length > 1 ||
    pages.some(
      (p) =>
        (p.fields && p.fields.length > 0) ||
        Boolean(p.backgroundUrl) ||
        Boolean(p.pdfPageNumber),
    ) ||
    Boolean(backgroundPdf);

  const canClear = !isReadOnly && hasContent;

  const handleConfirm = () => {
    clearAllPages();
    toast.info("Đã xóa toàn bộ trang");
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canClear}
          className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-40"
          title="Xóa toàn bộ trang (đưa về 1 trang trắng mặc định)"
        >
          <Trash2 className="size-3.5 mr-1" />
          Xóa toàn bộ trang
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>Xác nhận xóa toàn bộ trang?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa tất cả các trang và đưa biểu mẫu về 1 trang trắng mặc định ban đầu. Bạn có chắc chắn muốn tiếp tục?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer text-xs">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            className="cursor-pointer text-xs"
          >
            Xác nhận xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
