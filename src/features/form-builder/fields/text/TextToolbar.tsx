import { TextCursorInput } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, TextFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function TextToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<TextFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.text, ...data };
  const { label, value = "", placeholder = "", showLabel, showDottedLine } = fieldData;

  return (
    <ToolbarPopover
      icon={TextCursorInput}
      label={value || label || "Điền chữ"}
      title="Cấu hình trường văn bản"
    >
      <ToolbarField label="Nhãn (Tiêu đề trường)">
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder="VD: Họ và tên..."
          className="h-7 text-xs"
        />
      </ToolbarField>

      <div className="flex flex-col gap-0.5 border-y border-border py-1.5 my-0.5">
        <ToolbarCheckbox
          label="Hiển thị nhãn"
          checked={showLabel}
          onCheckedChange={(checked) => onDataChange({ showLabel: checked })}
        />
        <ToolbarCheckbox
          label="Hiển thị dòng kẻ chấm"
          checked={showDottedLine}
          onCheckedChange={(checked) => onDataChange({ showDottedLine: checked })}
        />
      </div>

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
