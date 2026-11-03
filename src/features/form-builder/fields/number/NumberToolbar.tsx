import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, NumberFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

function getLimitLabel(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${min}${FORM_BUILDER_LABELS.fields.number.rangeSeparator}${max}`;
  if (min !== undefined) return `≥ ${min}`;
  if (max !== undefined) return `≤ ${max}`;
  return FORM_BUILDER_LABELS.fields.number.limit;
}

function NumberInput({
  value,
  placeholder,
  onChange,
}: {
  value?: number;
  placeholder: string;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <Input
      type="number"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
      placeholder={placeholder}
      className="h-7 text-xs"
    />
  );
}

export function NumberToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<NumberFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.number, ...data };
  const { value, min, max, label, placeholder = "", showLabel, showDottedLine } = fieldData;

  return (
    <ToolbarPopover
      icon={SlidersHorizontal}
      label={value !== undefined ? `${FORM_BUILDER_LABELS.fields.number.valuePrefix} ${value}` : label || getLimitLabel(min, max)}
      title={FORM_BUILDER_LABELS.fields.number.configure}
    >
      <ToolbarField label={FORM_BUILDER_LABELS.fields.common.fieldLabel}>
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.number.labelExample}
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

      <ToolbarField label={FORM_BUILDER_LABELS.fields.number.value}>
        <NumberInput
          value={value}
          placeholder={FORM_BUILDER_LABELS.fields.number.valueExample}
          onChange={(next) => onDataChange({ value: next })}
        />
      </ToolbarField>

      {value !== undefined && (
        <ToolbarClearButton onClick={() => onDataChange({ value: undefined })}>
          {FORM_BUILDER_LABELS.fields.common.clearValue}
        </ToolbarClearButton>
      )}

      <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
        <ToolbarField label={FORM_BUILDER_LABELS.fields.number.minimum}>
          <NumberInput
            value={min}
            placeholder={FORM_BUILDER_LABELS.fields.common.noLimit}
            onChange={(next) => onDataChange({ min: next })}
          />
        </ToolbarField>
        <ToolbarField label={FORM_BUILDER_LABELS.fields.number.maximum}>
          <NumberInput
            value={max}
            placeholder={FORM_BUILDER_LABELS.fields.common.noLimit}
            onChange={(next) => onDataChange({ max: next })}
          />
        </ToolbarField>
      </div>

      <ToolbarField label={FORM_BUILDER_LABELS.fields.common.placeholder}>
        <Input
          value={placeholder}
          onChange={(e) => onDataChange({ placeholder: e.target.value })}
          placeholder={FORM_BUILDER_LABELS.fields.number.placeholderExample}
          className="h-7 text-xs"
        />
      </ToolbarField>
    </ToolbarPopover>
  );
}
