import type { FieldProps, NumberFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";

export function NumberField({
  data,
  width,
  onDataChange,
}: FieldProps<NumberFieldData> = {}) {
  const currentLabel = data?.label ?? "Số";
  const currentValue = data?.value !== undefined ? String(data.value) : undefined;

  return (
    <DottedFieldLine
      label={currentLabel}
      value={currentValue}
      width={width}
      onLabelSave={(newLabel) => {
        onDataChange?.({ label: newLabel });
      }}
    />
  );
}


