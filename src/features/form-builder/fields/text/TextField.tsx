import type { FieldProps, TextFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";

export function TextField({
  data,
  width,
  onDataChange,
}: FieldProps<TextFieldData> = {}) {
  const currentLabel = data?.label ?? "Họ và tên";
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


