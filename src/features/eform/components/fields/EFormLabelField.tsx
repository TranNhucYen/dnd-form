'use client'

import { useTranslation } from 'react-i18next'
import type { LabelFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";

interface EFormLabelFieldProps {
  data: LabelFieldData;
  style?: FieldStyle;
}

export function EFormLabelField({ data, style }: EFormLabelFieldProps) {
  const { t } = useTranslation()
  return (
    <div
      style={{
        color: style?.color,
        fontSize: style?.fontSize || "14px",
        fontWeight: style?.fontWeight,
        fontStyle: style?.fontStyle,
        textAlign: style?.textAlign || "left",
        textDecoration: style?.textDecoration,
      }}
      className="w-full py-1 text-neutral-800 leading-relaxed break-words"
    >
      {data.value || t('eform.labelFallback')}
    </div>
  );
}
