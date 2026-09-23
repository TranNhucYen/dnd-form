import type { FieldProps, NumberFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function NumberField({
  data,
  width,
  onDataChange,
}: FieldProps<NumberFieldData> = {}) {
  const currentLabel = data?.label ?? DEFAULT_FIELD_DATA.number.label;
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


