import { TextCursorInput } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, TextFieldData } from "../types/field.types";

export function TextToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<TextFieldData>) {
  const value = data?.value ?? "";
  const placeholder = data?.placeholder ?? "";

  return (
    <ToolbarPopover
      icon={TextCursorInput}
      label={value || "Điền chữ"}
      title="Điền giá trị văn bản"
    >
      <ToolbarField label="Giá trị (điền sẵn)">
        <Input
          value={value}
          onChange={(e) => onDataChange({ value: e.target.value })}
          placeholder="VD: Nguyễn Văn A..."
          className="h-7 text-xs"
        />
      </ToolbarField>

      {value && (
        <ToolbarClearButton onClick={() => onDataChange({ value: "" })}>
          Xóa giá trị (để trống)
        </ToolbarClearButton>
      )}

      <ToolbarField label="Gợi ý (Placeholder)">
        <Input
          value={placeholder}
          onChange={(e) => onDataChange({ placeholder: e.target.value })}
          placeholder="VD: Nhập họ và tên..."
          className="h-7 text-xs"
        />
      </ToolbarField>
    </ToolbarPopover>
  );
}
