import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, DateFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

// Ngày được lưu trong data dưới dạng chuỗi "dd/MM/yyyy", còn <input type="date"> dùng "yyyy-MM-dd"
function toInputValue(value?: string) {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
}

function fromInputValue(inputValue: string) {
  const [year, month, day] = inputValue.split("-");
  return inputValue ? `${day}/${month}/${year}` : undefined;
}

function getToday() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${now.getFullYear()}`;
}

export function DateToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<DateFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.date, ...data };
  const { label, value, showDateLabels, showDottedLine } = fieldData;

  return (
    <ToolbarPopover
      icon={CalendarDays}
      label={value ? `${label ? `${label}, ` : ""}${value}` : label || "Ngày tháng"}
      title="Chỉnh sửa địa danh và ngày tháng"
    >
      <ToolbarField label="Địa danh (Tỉnh/Thành phố)">
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder="VD: Hà Nội..."
          className="h-7 text-xs"
        />
      </ToolbarField>

      <div className="flex flex-col gap-0.5 border-y border-border py-1.5 my-0.5">
        <ToolbarCheckbox
          label="Hiển thị chữ 'ngày, tháng, năm'"
          checked={showDateLabels}
          onCheckedChange={(checked) => onDataChange({ showDateLabels: checked })}
        />
        <ToolbarCheckbox
          label="Hiển thị dòng kẻ chấm"
          checked={showDottedLine}
          onCheckedChange={(checked) => onDataChange({ showDottedLine: checked })}
        />
      </div>

      {!showDateLabels && (
        <div className="border-b border-border pb-1.5 mb-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDataChange({ slots: undefined })}
            className="h-7 w-full text-xs text-muted-foreground hover:text-foreground justify-center"
          >
            Đặt lại vị trí 4 ô mặc định
          </Button>
        </div>
      )}

      <ToolbarField label="Ngày tháng năm">
        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            value={toInputValue(value)}
            onChange={(e) => onDataChange({ value: fromInputValue(e.target.value) })}
            className="h-7 flex-1 text-xs"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDataChange({ value: getToday() })}
            className="h-7 shrink-0 px-2 text-[11px]"
          >
            Hôm nay
          </Button>
        </div>
      </ToolbarField>

      {value && (
        <ToolbarClearButton onClick={() => onDataChange({ value: undefined })}>
          Xóa ngày (để trống)
        </ToolbarClearButton>
      )}
    </ToolbarPopover>
  );
}
