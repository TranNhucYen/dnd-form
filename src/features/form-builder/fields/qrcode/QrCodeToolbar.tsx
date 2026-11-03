import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToolbarField, ToolbarPopover } from "../shared/ToolbarPopover";
import type { FieldToolbarProps, QrCodeFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function QrCodeToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<QrCodeFieldData>) {
  const value = data?.value ?? DEFAULT_FIELD_DATA.qrcode.value;

  return (
    <ToolbarPopover icon={QrCode} label={FORM_BUILDER_LABELS.fields.qrcode.content} title={FORM_BUILDER_LABELS.fields.qrcode.configure}>
      <ToolbarField label={FORM_BUILDER_LABELS.fields.qrcode.label}>
        <Input
          value={value}
          onChange={(e) => onDataChange({ value: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.qrcode.urlExample}
          className="h-7 text-xs"
        />
      </ToolbarField>
    </ToolbarPopover>
  );
}
