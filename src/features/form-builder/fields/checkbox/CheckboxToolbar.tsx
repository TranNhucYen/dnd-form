import { CheckSquare2, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, CheckboxFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function CheckboxToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<CheckboxFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.checkbox, ...data };
  const { checked, label, showLabel, showBorder } = fieldData;

  return (
    <ToolbarPopover
      icon={checked ? CheckSquare2 : Square}
      label={label || (checked ? FORM_BUILDER_LABELS.fields.checkbox.selected : FORM_BUILDER_LABELS.fields.checkbox.fallback)}
      title={FORM_BUILDER_LABELS.fields.checkbox.configure}
    >
      <ToolbarField label={FORM_BUILDER_LABELS.fields.checkbox.label}>
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.checkbox.example}
          className="h-7 text-xs"
        />
      </ToolbarField>

      <div className="flex flex-col gap-0.5 border-y border-border py-1.5 my-0.5">
        <ToolbarCheckbox
          label={FORM_BUILDER_LABELS.fields.common.showLabel}
          checked={showLabel}
          onCheckedChange={(checked) => onDataChange({ showLabel: checked })}
        />
        <ToolbarCheckbox
          label={FORM_BUILDER_LABELS.fields.checkbox.border}
          checked={showBorder}
          onCheckedChange={(checked) => onDataChange({ showBorder: checked })}
        />
        <ToolbarCheckbox
          label={FORM_BUILDER_LABELS.fields.checkbox.checked}
          checked={checked}
          onCheckedChange={(nextChecked) => onDataChange({ checked: nextChecked })}
        />
      </div>
    </ToolbarPopover>
  );
}
