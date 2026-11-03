"use client";

import { FilePlusCorner } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function NewFormTool() {
  const triggerNewForm = useFormBuilderStore((state) => state.triggerNewForm);
  const isReadOnly = useFormBuilderStore((state) => state.isReadOnly);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => triggerNewForm()}
      disabled={isReadOnly}
      title={FORM_BUILDER_LABELS.toolbar.newForm}
      className="p-0 hover:text-foreground text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      <FilePlusCorner className="size-3.5 text-primary" />
    </Button>
  );
}
