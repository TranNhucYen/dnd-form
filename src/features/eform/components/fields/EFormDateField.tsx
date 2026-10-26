import type { DateFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EFormDateFieldProps {
  data: DateFieldData;
  style?: FieldStyle;
  onChange?: (value: string) => void;
}

function toInputDateValue(raw?: string): string {
  if (!raw) return "";
  const parts = raw.split("/");
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2].padStart(4, "20");
    return `${y}-${m}-${d}`;
  }
  return "";
}

export function EFormDateField({ data, style, onChange }: EFormDateFieldProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label
        style={{
          color: style?.parts?.label?.color || style?.color,
          fontSize: style?.parts?.label?.fontSize,
          fontWeight: style?.parts?.label?.fontWeight,
        }}
        className="text-xs md:text-sm font-medium text-neutral-700"
      >
        {data.label ? `${data.label} (Ngày/Tháng/Năm)` : "Ngày tháng"}
      </Label>
      <Input
        type="date"
        defaultValue={toInputDateValue(data.value)}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-9 w-full bg-white text-xs md:text-sm text-neutral-700"
      />
    </div>
  );
}
