import type { FieldProps, TextFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function TextField({
  data,
  width,
  onDataChange,
}: FieldProps<TextFieldData> = {}) {
  const currentLabel = data?.label ?? DEFAULT_FIELD_DATA.text.label;
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


