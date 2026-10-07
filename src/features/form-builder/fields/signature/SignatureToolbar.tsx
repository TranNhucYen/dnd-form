import { UserCheck, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolbarField, ToolbarPopover } from "../shared/ToolbarPopover";
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
  const defaults = DEFAULT_FIELD_DATA.signature;

  return (
    <ToolbarPopover
      icon={UserCheck}
      label="Người ký"
      title="Cấu hình thông tin người ký"
    >
      {TEXT_FIELDS.map(({ key, label, placeholder }) => (
        <ToolbarField key={key} label={label}>
          <Input
            value={data?.[key] ?? defaults[key] ?? ""}
            onChange={(e) => onDataChange({ [key]: e.target.value })}
            placeholder={placeholder}
            className="h-7 text-xs"
          />
        </ToolbarField>
      ))}

      {data?.value && (
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
