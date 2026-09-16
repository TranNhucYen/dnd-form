import type { FieldProps } from "../types/field.types";
import { DottedFieldLine } from "../shared/DottedFieldLine";

export function TextField({
  label = "Họ và tên",
  value,
  width,
}: FieldProps = {}) {
  return <DottedFieldLine label={label} value={value} width={width} />;
}
