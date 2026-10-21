import type { CheckboxFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Checkbox } from "@/components/ui/checkbox";

interface EFormCheckboxFieldProps {
  data: CheckboxFieldData;
  style?: FieldStyle;
}

export function EFormCheckboxField({ data, style }: EFormCheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
      <Checkbox />
      {data.showLabel !== false && (
        <span
          style={{
            color: style?.parts?.label?.color || style?.color,
            fontSize: style?.parts?.label?.fontSize,
            fontWeight: style?.parts?.label?.fontWeight,
          }}
          className="text-xs md:text-sm text-neutral-800"
        >
          {data.label || "Tùy chọn"}
        </span>
      )}
    </label>
  );
}
