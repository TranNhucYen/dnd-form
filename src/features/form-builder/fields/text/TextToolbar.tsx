import { TextCursorInput } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, TextFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function TextToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<TextFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.text, ...data };
  const { label, value = "", placeholder = "", showLabel, showDottedLine } = fieldData;

  return (
    <ToolbarPopover
      icon={TextCursorInput}
      label={value || label || FORM_BUILDER_LABELS.fields.text.fallback}
      title={FORM_BUILDER_LABELS.fields.text.configure}
    >
      <ToolbarField label={FORM_BUILDER_LABELS.fields.common.fieldLabel}>
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.text.labelExample}
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
          label={FORM_BUILDER_LABELS.fields.common.showDottedLine}
          checked={showDottedLine}
          onCheckedChange={(checked) => onDataChange({ showDottedLine: checked })}
        />
      </div>

      <ToolbarField label={FORM_BUILDER_LABELS.fields.common.presetValue}>
        <Input
          value={value}
          onChange={(e) => onDataChange({ value: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.text.valueExample}
          className="h-7 text-xs"
        />
      </ToolbarField>

      {value && (
        <ToolbarClearButton onClick={() => onDataChange({ value: "" })}>
          {FORM_BUILDER_LABELS.fields.common.clearValue}
        </ToolbarClearButton>
      )}

      <ToolbarField label={FORM_BUILDER_LABELS.fields.common.placeholder}>
        <Input
          value={placeholder}
          onChange={(e) => onDataChange({ placeholder: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.text.placeholderExample}
          className="h-7 text-xs"
        />
      </ToolbarField>
    </ToolbarPopover>
  );
}
