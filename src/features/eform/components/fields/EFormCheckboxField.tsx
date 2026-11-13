'use client'

import { useTranslation } from 'react-i18next'
import type { CheckboxFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Checkbox } from "@/components/ui/checkbox";

interface EFormCheckboxFieldProps {
  data: CheckboxFieldData;
  style?: FieldStyle;
  onChange?: (checked: boolean) => void;
}

export function EFormCheckboxField({ data, style, onChange }: EFormCheckboxFieldProps) {
  const { t } = useTranslation()
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
      <Checkbox
        defaultChecked={Boolean(data.checked)}
        onCheckedChange={(checked) => onChange?.(Boolean(checked))}
      />
      <span
        style={{
          color: style?.parts?.label?.color || style?.color,
          fontSize: style?.parts?.label?.fontSize,
          fontWeight: style?.parts?.label?.fontWeight,
        }}
        className="text-xs md:text-sm text-neutral-800"
      >
        {data.label || t('eform.optionFallback')}
      </span>
    </label>
  );
}
