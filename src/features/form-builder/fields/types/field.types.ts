import type { FieldData } from "../../types/formBuilder.types";

export type {
  TextFieldData,
  NumberFieldData,
  SelectFieldData,
  DateFieldData,
  LabelFieldData,
  CheckboxFieldData,
  LineFieldData,
  QrCodeFieldData,
  TextareaFieldData,
  SignatureFieldData,
  ImageFieldData,
  DatatableFieldData,
  FieldDataMap,
  FieldData,
} from "../../types/formBuilder.types";

export type FieldProps<T = FieldData> = {
  id?: string;
  data?: T;
  width?: number;
  height?: number;
  onDataChange?: (patch: Partial<T>) => void;
};

export type FieldComponent<T = FieldData> = (props: FieldProps<T>) => React.ReactNode;



