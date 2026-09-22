import type { FieldProps, SelectFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";

export function SelectField({
  data,
  width,
  onDataChange,
}: FieldProps<SelectFieldData> = {}) {
  const currentLabel = data?.label ?? "Danh sách";
  const currentValue = data?.value;

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


