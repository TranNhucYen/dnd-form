import type { FieldProps } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";

export function NumberField({
  label = "Số",
  value,
  width,
}: FieldProps = {}) {
  return <DottedFieldLine label={label} value={value} width={width} />;
}
