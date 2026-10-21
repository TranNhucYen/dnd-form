import type { FieldProps, NumberFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function NumberField({
  id,
  data,
  style,
  width,
  onDataChange,
}: FieldProps<NumberFieldData>) {
  const fieldData = data;
  const currentValue = fieldData.value !== undefined ? String(fieldData.value) : undefined;

  return (
    <DottedFieldLine
      fieldId={id}
      label={fieldData.label}
      value={currentValue}
      width={width}
      showLabel={fieldData.showLabel}
      showDottedLine={fieldData.showDottedLine}
      placeholder={fieldData.placeholder}
      style={style}
      onLabelSave={(newLabel) => {
        onDataChange?.({ label: newLabel });
      }}
    />
  );
}


