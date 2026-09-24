"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function SaveTool() {
  const triggerSave = useFormBuilderStore((state) => state.triggerSave);
  const isSaving = useFormBuilderStore((state) => state.isSaving);
  const hasOnSave = useFormBuilderStore((state) => !!state.onSave);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => triggerSave()}
      disabled={isSaving || !hasOnSave}
      title="Lưu (Ctrl + S)"
      className="p-0 hover:text-foreground"
    >
      <Save className="size-3.5 text-primary" />
    </Button>
  );
}
