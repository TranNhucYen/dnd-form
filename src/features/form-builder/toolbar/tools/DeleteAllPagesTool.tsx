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
import { FORM_BUILDER_LABELS } from "../../constants/labels";

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
    toast.info(FORM_BUILDER_LABELS.toolbar.deletePagesDialog.success);
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
          title={FORM_BUILDER_LABELS.toolbar.deleteAllPages}
        >
          <Trash2 className="size-3.5 mr-1" />
          {FORM_BUILDER_LABELS.toolbar.deleteAllPagesButton}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>{FORM_BUILDER_LABELS.toolbar.deletePagesDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {FORM_BUILDER_LABELS.toolbar.deletePagesDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer text-xs">
            {FORM_BUILDER_LABELS.toolbar.deletePagesDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            className="cursor-pointer text-xs"
          >
            {FORM_BUILDER_LABELS.toolbar.deletePagesDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
