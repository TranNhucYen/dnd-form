import type { TextareaFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EFormTextareaFieldProps {
  data: TextareaFieldData;
  style?: FieldStyle;
}

export function EFormTextareaField({ data, style }: EFormTextareaFieldProps) {
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
        Nội dung chi tiết
      </Label>
      <Textarea
        rows={3}
        placeholder="Nhập nội dung văn bản dài..."
        className={`w-full bg-white text-xs md:text-sm placeholder:text-neutral-400 ${
          data.showBorder === false ? "border-transparent shadow-none" : ""
        }`}
      />
    </div>
  );
}
