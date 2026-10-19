import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, NumberFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

function getLimitLabel(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${min} đến ${max}`;
  if (min !== undefined) return `≥ ${min}`;
  if (max !== undefined) return `≤ ${max}`;
  return "Giới hạn số";
}

function NumberInput({
  value,
  placeholder,
  onChange,
}: {
  value?: number;
  placeholder: string;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <Input
      type="number"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
      placeholder={placeholder}
      className="h-7 text-xs"
    />
  );
}

export function NumberToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<NumberFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.number, ...data };
  const { value, min, max, label, placeholder = "", showLabel, showDottedLine } = fieldData;

  return (
    <ToolbarPopover
      icon={SlidersHorizontal}
      label={value !== undefined ? `Số: ${value}` : label || getLimitLabel(min, max)}
      title="Cấu hình trường số và giá trị"
    >
      <ToolbarField label="Nhãn (Tiêu đề trường)">
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder="VD: Số lượng..."
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

      <ToolbarField label="Giá trị số (điền sẵn)">
        <NumberInput
          value={value}
          placeholder="VD: 10, 100..."
          onChange={(next) => onDataChange({ value: next })}
        />
      </ToolbarField>

      {value !== undefined && (
        <ToolbarClearButton onClick={() => onDataChange({ value: undefined })}>
          Xóa giá trị (để trống)
        </ToolbarClearButton>
      )}

      <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
        <ToolbarField label="Tối thiểu (Min)">
          <NumberInput
            value={min}
            placeholder="Không giới hạn"
            onChange={(next) => onDataChange({ min: next })}
          />
        </ToolbarField>
        <ToolbarField label="Tối đa (Max)">
          <NumberInput
            value={max}
            placeholder="Không giới hạn"
            onChange={(next) => onDataChange({ max: next })}
          />
        </ToolbarField>
      </div>

      <ToolbarField label="Gợi ý (Placeholder)">
        <Input
          value={placeholder}
          onChange={(e) => onDataChange({ placeholder: e.target.value })}
          placeholder="VD: Nhập số lượng, số tiền..."
          className="h-7 text-xs"
        />
      </ToolbarField>
    </ToolbarPopover>
  );
}
