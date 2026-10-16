import type { FieldProps, SelectFieldData } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function SelectField({
  data,
  width,
  onDataChange,
}: FieldProps<SelectFieldData> = {}) {
  const fieldData = { ...DEFAULT_FIELD_DATA.select, ...data };

  return (
    <DottedFieldLine
      label={fieldData.label}
      value={fieldData.value}
      width={width}
      showLabel={fieldData.showLabel}
      showDottedLine={fieldData.showDottedLine}
      onLabelSave={(newLabel) => {
        onDataChange?.({ label: newLabel });
      }}
    />
  );
}


