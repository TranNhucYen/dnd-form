import { CheckSquare2, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, CheckboxFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function CheckboxToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<CheckboxFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.checkbox, ...data };
  const { checked, label, showLabel, showBorder } = fieldData;

  return (
    <ToolbarPopover
      icon={checked ? CheckSquare2 : Square}
      label={label || (checked ? "Đã chọn" : "Hộp kiểm")}
      title="Cấu hình hộp kiểm (Checkbox)"
    >
      <ToolbarField label="Nhãn (Tiêu đề hộp kiểm)">
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder="VD: Nam, Nữ, Đồng ý..."
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
          label="Hiển thị khung viền ô vuông"
          checked={showBorder}
          onCheckedChange={(checked) => onDataChange({ showBorder: checked })}
        />
        <ToolbarCheckbox
          label="Trạng thái đã chọn (Checked)"
          checked={checked}
          onCheckedChange={(nextChecked) => onDataChange({ checked: nextChecked })}
        />
      </div>
    </ToolbarPopover>
  );
}
