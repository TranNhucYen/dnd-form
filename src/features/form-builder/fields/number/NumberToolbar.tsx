import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, NumberFieldData } from "../types/field.types";

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
  const { value, min, max } = data ?? {};
  const placeholder = data?.placeholder ?? "";

  return (
    <ToolbarPopover
      icon={SlidersHorizontal}
      label={value !== undefined ? `Số: ${value}` : getLimitLabel(min, max)}
      title="Cấu hình trường số và giá trị"
    >
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

      <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-2">
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
