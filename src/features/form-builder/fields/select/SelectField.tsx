import type { FieldProps, SelectFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function SelectField({
  data,
  width,
  onDataChange,
}: FieldProps<SelectFieldData> = {}) {
  const currentLabel = data?.label ?? DEFAULT_FIELD_DATA.select.label;
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


