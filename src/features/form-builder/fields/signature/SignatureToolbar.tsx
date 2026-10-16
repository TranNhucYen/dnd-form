import { UserCheck, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ToolbarCheckbox,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, SignatureFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

const TEXT_FIELDS = [
  {
    key: "label",
    label: "Tiêu đề (Dòng 1)",
    placeholder: "VD: Người làm đơn, Giám đốc...",
  },
  {
    key: "subTitle",
    label: "Ghi chú / Chức danh (Dòng 2)",
    placeholder: "VD: (Ký, ghi rõ họ tên)...",
  },
  {
    key: "signerName",
    label: "Họ tên người ký (Dòng 3)",
    placeholder: "VD: Nguyễn Văn A...",
  },
] as const;

export function SignatureToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<SignatureFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.signature, ...data };
  const { showSignatureLabels, showSignerName } = fieldData;

  return (
    <ToolbarPopover
      icon={UserCheck}
      label={fieldData.label || "Người ký"}
      title="Cấu hình thông tin người ký"
    >
      <div className="flex flex-col gap-0.5 border-b border-border pb-1.5 mb-1">
        <ToolbarCheckbox
          label="Hiển thị tiêu đề & ghi chú"
          checked={showSignatureLabels}
          onCheckedChange={(checked) => onDataChange({ showSignatureLabels: checked })}
        />
        <ToolbarCheckbox
          label="Hiển thị họ tên người ký"
          checked={showSignerName}
          onCheckedChange={(checked) => onDataChange({ showSignerName: checked })}
        />
      </div>

      {TEXT_FIELDS.map(({ key, label, placeholder }) => (
        <ToolbarField key={key} label={label}>
          <Input
            value={fieldData[key] ?? ""}
            onChange={(e) => onDataChange({ [key]: e.target.value })}
            placeholder={placeholder}
            className="h-7 text-xs"
          />
        </ToolbarField>
      ))}

      {fieldData.value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onDataChange({ value: undefined })}
          className="h-7 gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Eraser className="size-3" />
          <span>Xóa chữ ký đã vẽ</span>
        </Button>
      )}
    </ToolbarPopover>
  );
}
