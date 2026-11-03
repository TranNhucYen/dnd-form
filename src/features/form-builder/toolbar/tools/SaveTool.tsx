"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function SaveTool() {
  const triggerSave = useFormBuilderStore((state) => state.triggerSave);
  const isSaving = useFormBuilderStore((state) => state.isSaving);
  const hasOnSave = useFormBuilderStore((state) => !!state.onSave);
  const isDirty = useFormBuilderStore((state) => state.isDirty);

  const canSave = hasOnSave && isDirty && !isSaving;

  return (
    <Button
      data-save-tool
      type="button"
      variant="ghost"
      onClick={() => triggerSave()}
      disabled={!canSave}
      title={isDirty ? FORM_BUILDER_LABELS.toolbar.save : FORM_BUILDER_LABELS.toolbar.saved}
      className="relative p-0 hover:text-foreground disabled:opacity-40 transition-opacity"
    >
      <Save className="size-3.5 text-primary" />
      {isDirty && (
        <span
          className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-amber-500 ring-1 ring-background animate-pulse"
          title={FORM_BUILDER_LABELS.toolbar.unsavedChanges}
        />
      )}
    </Button>
  );
}
