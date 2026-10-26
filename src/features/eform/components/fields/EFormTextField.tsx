import type { TextFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EFormTextFieldProps {
  data: TextFieldData;
  style?: FieldStyle;
  onChange?: (value: string) => void;
}

export function EFormTextField({ data, style, onChange }: EFormTextFieldProps) {
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
          {data.label || "Văn bản"}
        </Label>
      )}
      <Input
        type="text"
        defaultValue={data.value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={data.placeholder || "Nhập thông tin..."}
        className="h-9 w-full bg-white text-xs md:text-sm placeholder:text-neutral-400"
      />
    </div>
  );
}
