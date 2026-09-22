import type { FieldType } from "../types/formBuilder.types";
import type { FieldComponent, FieldProps } from "./types/field.types";
import { LabelField } from "./label/LabelField";
import { TextField } from "./text/TextField";
import { TextareaField } from "./textarea/TextareaField";
import { NumberField } from "./number/NumberField";
import { DateField } from "./date/DateField";
import { SelectField } from "./select/SelectField";
import { LineField } from "./line/LineField";
import { CheckboxField } from "./checkbox/CheckboxField";
import { SignatureField } from "./signature/SignatureField";
import { QrCodeField } from "./qrcode/QrCodeField";
import { ImageField } from "./image/ImageField";
import { DatatableField } from "./datatable/DatatableField";

export type { FieldProps };

const fieldRegistry: Record<FieldType, FieldComponent<any>> = {
  label: LabelField,
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  date: DateField,
  select: SelectField,
  line: LineField,
  checkbox: CheckboxField,
  signature: SignatureField,
  qrcode: QrCodeField,
  image: ImageField,
  datatable: DatatableField,
};

/**
 * FieldRenderer: Component trung gian (Bridge) nhận vào type và các props liên quan,
 * sau đó tự động tìm và render component tương ứng trong Registry
 */
export function FieldRenderer({
  type,
  id,
  data,
  width,
  height,
  onDataChange,
}: { type: FieldType } & FieldProps) {
  const Field = fieldRegistry[type];

  return (
    <Field
      id={id}
      data={data}
      width={width}
      height={height}
      onDataChange={onDataChange}
    />
  );
}
