import type { FieldProps, NumberFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function NumberField({
  data,
  width,
  onDataChange,
}: FieldProps<NumberFieldData> = {}) {
  const fieldData = { ...DEFAULT_FIELD_DATA.number, ...data };
  const currentValue = fieldData.value !== undefined ? String(fieldData.value) : undefined;

  return (
    <DottedFieldLine
      label={fieldData.label}
      value={currentValue}
      width={width}
      showLabel={fieldData.showLabel}
      showDottedLine={fieldData.showDottedLine}
      placeholder={fieldData.placeholder}
      onLabelSave={(newLabel) => {
        onDataChange?.({ label: newLabel });
      }}
    />
  );
}


