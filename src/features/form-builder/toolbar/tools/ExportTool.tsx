"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function ExportTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const onExport = useFormBuilderStore((state) => state.onExport);
  const isSaving = useFormBuilderStore((state) => state.isSaving);
  const labels = FORM_BUILDER_LABELS.toolbar.exportTool;

  const handleExport = async () => {
    if (!onExport || isProcessing || isSaving) return;
    setIsProcessing(true);
    try {
      await onExport();
      setIsOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!onExport || isSaving || isProcessing}
        onClick={() => setIsOpen(true)}
        className="h-7 cursor-pointer px-2.5 text-xs"
        title={labels.buttonTitle}
      >
        <Download className="mr-1 size-3.5" />
        {labels.button}
      </Button>
      <AlertDialog open={isOpen} onOpenChange={(open) => !isProcessing && setIsOpen(open)}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{labels.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="cursor-pointer text-xs">
              {labels.cancel}
            </AlertDialogCancel>
            <Button type="button" disabled={isProcessing} onClick={handleExport} className="cursor-pointer text-xs">
              {isProcessing && <Loader2 className="mr-2 size-3.5 animate-spin" />}
              {isProcessing ? labels.processing : labels.confirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
