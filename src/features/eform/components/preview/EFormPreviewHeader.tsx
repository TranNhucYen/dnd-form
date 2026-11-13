"use client";

import { useTranslation } from 'react-i18next'
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EFormPreviewHeaderProps {
  title?: string;
}

export function EFormPreviewHeader({ title }: EFormPreviewHeaderProps) {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-sm shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.close()}
          className="gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer shrink-0"
          title={t('eform.generated.dongTabXemTruoc')}
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">{t('eform.generated.dong')}</span>
        </Button>
        <div className="h-4 w-px bg-neutral-200 hidden sm:block shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-neutral-900 truncate max-w-[220px] sm:max-w-[400px]">
            {title || t('eform.previewTitle')}
          </span>
          <span className="text-[10px] text-neutral-400">
            {t('eform.generated.cheDoXemTruocEForm')}
          </span>
        </div>
      </div>
    </header>
  );
}
