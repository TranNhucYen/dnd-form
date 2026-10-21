import type { SelectFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Label } from "@/components/ui/label";

interface EFormSelectFieldProps {
  data: SelectFieldData;
  style?: FieldStyle;
}

export function EFormSelectField({ data, style }: EFormSelectFieldProps) {
  const showLabel = data.showLabel !== false;
  const options = Array.isArray(data.options) ? data.options : [];

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
          {data.label || "Lựa chọn"}
        </Label>
      )}
      <select
        defaultValue=""
        className="h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs md:text-sm shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="" disabled>
          -- Vui lòng chọn --
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
