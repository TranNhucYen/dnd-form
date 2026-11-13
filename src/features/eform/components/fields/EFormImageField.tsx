'use client'

import { useTranslation } from 'react-i18next'
import type { ImageFieldData } from "@/features/form-builder/types/formBuilder.types";
import { ImageIcon } from "lucide-react";

interface EFormImageFieldProps {
  data: ImageFieldData;
}

export function EFormImageField({ data }: EFormImageFieldProps) {
  const { t } = useTranslation()
  if (data.value) {
    return (
      <div className="flex w-full items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.value}
          alt={t('eform.generated.hinhAnhBieuMau')}
          className="max-h-[300px] w-auto max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100px] w-full flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-xs text-neutral-400">
      <ImageIcon className="size-6 text-neutral-300 mb-1" />
      <span>{t('eform.generated.hinhAnh')}</span>
    </div>
  );
}
