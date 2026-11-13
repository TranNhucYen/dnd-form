'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Languages, Clock, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/i18n/use-locale'
import { LocalizationSettings as ILocalizationSettings } from '../types/settings.type'

interface LocalizationSettingsProps {
  settings: ILocalizationSettings
  onChange: (updated: Partial<ILocalizationSettings>) => void
}

export function LocalizationSettings({
  settings,
  onChange,
}: LocalizationSettingsProps) {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold">{t('settings.localizationTitle')}</CardTitle>
        <CardDescription className="text-xs">
          {t('settings.localizationDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Languages className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">{t('settings.languageLabel')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.languageDescription')}
              </p>
            </div>
          </div>

          <Select
            value={locale}
            onValueChange={(val: 'vi' | 'en') => {
              setLocale(val)
              onChange({ language: val })
            }}
          >
            <SelectTrigger className="w-full sm:w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi" className="text-xs">
                {t('settings.vietnamese')}
              </SelectItem>
              <SelectItem value="en" className="text-xs">
                {t('settings.english')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">{t('settings.dateFormatLabel')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.dateFormatDescription')}
              </p>
            </div>
          </div>

          <Select
            value={settings.dateFormat}
            onValueChange={(val: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd') =>
              onChange({ dateFormat: val })
            }
          >
            <SelectTrigger className="w-full sm:w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/mm/yyyy" className="text-xs">
                dd/mm/yyyy (21/08/2026)
              </SelectItem>
              <SelectItem value="mm/dd/yyyy" className="text-xs">
                mm/dd/yyyy (08/21/2026)
              </SelectItem>
              <SelectItem value="yyyy-mm-dd" className="text-xs">
                yyyy-mm-dd (2026-08-21)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timezone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">{t('settings.timezoneLabel')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.timezoneDescription')}
              </p>
            </div>
          </div>

          <Select
            value={settings.timezone}
            onValueChange={(val) => onChange({ timezone: val })}
          >
            <SelectTrigger className="w-full sm:w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Ho_Chi_Minh" className="text-xs">
                {t('settings.generated.gmt0700HaNoiTpHcm')}
              </SelectItem>
              <SelectItem value="UTC" className="text-xs">
                GMT+00:00 (UTC)
              </SelectItem>
              <SelectItem value="America/New_York" className="text-xs">
                GMT-05:00 (New York)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
