import type { FieldDataMap, FieldType } from "../types/formBuilder.types";
import type { FieldToolbarComponent, FieldToolbarProps } from "./types/field.types";
import { SelectToolbar } from "./select/SelectToolbar";
import { NumberToolbar } from "./number/NumberToolbar";
import { CheckboxToolbar } from "./checkbox/CheckboxToolbar";
import { TextToolbar } from "./text/TextToolbar";
import { QrCodeToolbar } from "./qrcode/QrCodeToolbar";
import { SignatureToolbar } from "./signature/SignatureToolbar";
import { ImageToolbar } from "./image/ImageToolbar";
import { DateToolbar } from "./date/DateToolbar";
import { DatatableToolbar } from "./datatable/DatatableToolbar";
import { TextareaToolbar } from "./textarea/TextareaToolbar";

const fieldToolbarRegistry: {
  [K in FieldType]?: FieldToolbarComponent<FieldDataMap[K]>;
} = {
  select: SelectToolbar,
  number: NumberToolbar,
  checkbox: CheckboxToolbar,
  text: TextToolbar,
  qrcode: QrCodeToolbar,
  signature: SignatureToolbar,
  image: ImageToolbar,
  date: DateToolbar,
  datatable: DatatableToolbar,
  textarea: TextareaToolbar,
};

/**
 * FieldToolbarRenderer: Bộ điều phối hiển thị thanh công cụ theo loại dữ liệu của Field
 */
export function FieldToolbarRenderer({
  type,
  id,
  data,
  onDataChange,
}: { type: FieldType } & FieldToolbarProps) {
  const Toolbar = fieldToolbarRegistry[type] as
    | FieldToolbarComponent<unknown>
    | undefined;
  if (!Toolbar) {
    return null;
  }

  return <Toolbar id={id} data={data} onDataChange={onDataChange} />;
}
