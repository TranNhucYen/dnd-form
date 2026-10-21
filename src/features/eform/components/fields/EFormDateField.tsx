import type { DateFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EFormDateFieldProps {
  data: DateFieldData;
  style?: FieldStyle;
}

export function EFormDateField({ data, style }: EFormDateFieldProps) {
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
        className="h-9 w-full bg-white text-xs md:text-sm text-neutral-700"
      />
    </div>
  );
}
