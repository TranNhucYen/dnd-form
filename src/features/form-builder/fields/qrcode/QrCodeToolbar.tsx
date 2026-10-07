import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToolbarField, ToolbarPopover } from "../shared/ToolbarPopover";
import type { FieldToolbarProps, QrCodeFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function QrCodeToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<QrCodeFieldData>) {
  const value = data?.value ?? DEFAULT_FIELD_DATA.qrcode.value;

  return (
    <ToolbarPopover icon={QrCode} label="Nội dung QR" title="Chỉnh sửa nội dung mã QR">
      <ToolbarField label="Nội dung mã QR (URL / Văn bản)">
        <Input
          value={value}
          onChange={(e) => onDataChange({ value: e.target.value })}
          placeholder="https://..."
          className="h-7 text-xs"
        />
      </ToolbarField>
    </ToolbarPopover>
  );
}
