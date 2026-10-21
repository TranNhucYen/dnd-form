import type {
  CheckboxFieldData,
  DatatableFieldData,
  DateFieldData,
  ImageFieldData,
  LabelFieldData,
  NumberFieldData,
  QrCodeFieldData,
  SelectFieldData,
  SignatureFieldData,
  TextFieldData,
  TextareaFieldData,
} from "@/features/form-builder/types/formBuilder.types";
import type { EFormElement } from "../../types/eform.types";
import { EFormTextField } from "./EFormTextField";
import { EFormNumberField } from "./EFormNumberField";
import { EFormSelectField } from "./EFormSelectField";
import { EFormDateField } from "./EFormDateField";
import { EFormTextareaField } from "./EFormTextareaField";
import { EFormCheckboxField } from "./EFormCheckboxField";
import { EFormSignatureField } from "./EFormSignatureField";
import { EFormLabelField } from "./EFormLabelField";
import { EFormImageField } from "./EFormImageField";
import { EFormQrCodeField } from "./EFormQrCodeField";
import { EFormLineField } from "./EFormLineField";
import { EFormDatatableField } from "./EFormDatatableField";

interface EFormFieldRendererProps {
  element: EFormElement;
}

export function EFormFieldRenderer({ element }: EFormFieldRendererProps) {
  const { type, rawField, style } = element;

  switch (type) {
    case "text":
      return (
        <EFormTextField
          data={rawField.data as TextFieldData}
          style={style}
        />
      );
    case "number":
      return (
        <EFormNumberField
          data={rawField.data as NumberFieldData}
          style={style}
        />
      );
    case "select":
      return (
        <EFormSelectField
          data={rawField.data as SelectFieldData}
          style={style}
        />
      );
    case "date":
      return (
        <EFormDateField
          data={rawField.data as DateFieldData}
          style={style}
        />
      );
    case "textarea":
      return (
        <EFormTextareaField
          data={rawField.data as TextareaFieldData}
          style={style}
        />
      );
    case "checkbox":
      return (
        <EFormCheckboxField
          data={rawField.data as CheckboxFieldData}
          style={style}
        />
      );
    case "signature":
      return (
        <EFormSignatureField
          data={rawField.data as SignatureFieldData}
          style={style}
        />
      );
    case "label":
      return (
        <EFormLabelField
          data={rawField.data as LabelFieldData}
          style={style}
        />
      );
    case "image":
      return <EFormImageField data={rawField.data as ImageFieldData} />;
    case "qrcode":
      return <EFormQrCodeField data={rawField.data as QrCodeFieldData} />;
    case "line":
      return <EFormLineField />;
    case "datatable":
      return (
        <EFormDatatableField data={rawField.data as DatatableFieldData} />
      );
    default:
      return null;
  }
}
