import type { FieldProps, TextFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";


export function TextField({
  id,
  data,
  style,
  width,
  onDataChange,
}: FieldProps<TextFieldData>) {
  const fieldData = data;

  return (
    <DottedFieldLine
      fieldId={id}
      label={fieldData.label}
      value={fieldData.value}
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


