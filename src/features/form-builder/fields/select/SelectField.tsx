import type { FieldProps, SelectFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function SelectField({
  id,
  data,
  style,
  width,
  onDataChange,
}: FieldProps<SelectFieldData>) {
  const fieldData = data;

  return (
    <DottedFieldLine
      fieldId={id}
      label={fieldData.label}
      value={fieldData.value}
      width={width}
      showLabel={fieldData.showLabel}
      showDottedLine={fieldData.showDottedLine}
      style={style}
      onLabelSave={(newLabel) => {
        onDataChange?.({ label: newLabel });
      }}
    />
  );
}


