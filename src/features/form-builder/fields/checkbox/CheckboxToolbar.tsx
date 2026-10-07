import { CheckSquare2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldToolbarProps, CheckboxFieldData } from "../types/field.types";

export function CheckboxToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<CheckboxFieldData>) {
  const isChecked = Boolean(data?.checked);

  const toggleChecked = () => {
    onDataChange({ checked: !isChecked });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleChecked}
      className={`h-7 gap-1 px-2 text-xs font-normal transition-colors ${
        isChecked ? "text-blue-600 hover:bg-blue-50" : "text-neutral-600 hover:bg-neutral-100"
      }`}
      title="Bật/tắt trạng thái chọn"
    >
      {isChecked ? (
        <CheckSquare2 className="size-3.5 text-blue-600" />
      ) : (
        <Square className="size-3.5 text-neutral-400" />
      )}
      <span>{isChecked ? "Đã chọn" : "Chưa chọn"}</span>
    </Button>
  );
}
