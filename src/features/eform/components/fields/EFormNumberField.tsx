import type { NumberFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EFormNumberFieldProps {
  data: NumberFieldData;
  style?: FieldStyle;
  onChange?: (value: number | undefined) => void;
}

export function EFormNumberField({ data, style, onChange }: EFormNumberFieldProps) {
  const showLabel = data.showLabel !== false;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {showLabel && (
        <Label
          style={{
            color: style?.parts?.label?.color || style?.color,
            fontSize: style?.parts?.label?.fontSize,
            fontWeight: style?.parts?.label?.fontWeight,
          }}
          className="text-xs md:text-sm font-medium text-neutral-700"
        >
          {data.label || "Số lượng / Giá trị"}
        </Label>
      )}
      <Input
        type="number"
        min={data.min}
        max={data.max}
        defaultValue={data.value !== undefined ? String(data.value) : ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange?.(val === "" ? undefined : Number(val));
        }}
        placeholder={data.placeholder || "0"}
        className="h-9 w-full bg-white text-xs md:text-sm placeholder:text-neutral-400"
      />
    </div>
  );
}
