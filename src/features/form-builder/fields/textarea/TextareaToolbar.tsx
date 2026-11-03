import { Square, SquareDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldToolbarProps, TextareaFieldData } from "../types/field.types";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function TextareaToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<TextareaFieldData>) {
  const showBorder = data?.showBorder ?? true;

  const toggleBorder = () => {
    onDataChange({ showBorder: !showBorder });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleBorder}
      className={`h-7 gap-1 px-2 text-xs font-normal transition-colors ${
        showBorder
          ? "text-blue-600 hover:bg-blue-50"
          : "text-neutral-600 hover:bg-neutral-100"
      }`}
      title={FORM_BUILDER_LABELS.fields.textarea.borderToggle}
    >
      {showBorder ? (
        <Square className="size-3.5 text-blue-600" />
      ) : (
        <SquareDashed className="size-3.5 text-neutral-400" />
      )}
      <span>{showBorder ? FORM_BUILDER_LABELS.fields.textarea.borderOn : FORM_BUILDER_LABELS.fields.textarea.borderOff}</span>
    </Button>
  );
}
