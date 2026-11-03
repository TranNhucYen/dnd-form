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
import { FORM_BUILDER_LABELS } from "../../constants/labels";

const TEXT_FIELDS = [
  {
    key: "label",
    label: FORM_BUILDER_LABELS.fields.signature.title,
    placeholder: FORM_BUILDER_LABELS.fields.signature.titleExample,
  },
  {
    key: "subTitle",
    label: FORM_BUILDER_LABELS.fields.signature.subtitle,
    placeholder: FORM_BUILDER_LABELS.fields.signature.subtitleExample,
  },
  {
    key: "signerName",
    label: FORM_BUILDER_LABELS.fields.signature.signerName,
    placeholder: FORM_BUILDER_LABELS.fields.signature.signerNameExample,
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
      label={fieldData.label || FORM_BUILDER_LABELS.fields.signature.signer}
      title={FORM_BUILDER_LABELS.fields.signature.configure}
    >
      <div className="flex flex-col gap-0.5 border-b border-border pb-1.5 mb-1">
        <ToolbarCheckbox
          label={FORM_BUILDER_LABELS.fields.signature.showTitleAndNote}
          checked={showSignatureLabels}
          onCheckedChange={(checked) => onDataChange({ showSignatureLabels: checked })}
        />
        <ToolbarCheckbox
          label={FORM_BUILDER_LABELS.fields.signature.showSignerName}
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
          <span>{FORM_BUILDER_LABELS.fields.signature.deleteDrawn}</span>
        </Button>
      )}
    </ToolbarPopover>
  );
}
