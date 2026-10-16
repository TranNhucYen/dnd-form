import type { FieldProps, TextFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function TextField({
  data,
  width,
  onDataChange,
}: FieldProps<TextFieldData> = {}) {
  const fieldData = { ...DEFAULT_FIELD_DATA.text, ...data };

  return (
    <DottedFieldLine
      label={fieldData.label}
      value={fieldData.value}
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


