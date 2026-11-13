'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Sun, Moon, Laptop } from 'lucide-react'

export function AppearanceSettings() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    {
      id: 'light',
      label: t('settings.generated.sangLightMode'),
      description: t('settings.generated.giaoDienNenSangPhuHopLamViecBan'),
      icon: Sun,
    },
    {
      id: 'dark',
      label: t('settings.generated.toiDarkMode'),
      description: t('settings.generated.giaoDienNenToiGiupGiamMoiMatKhi'),
      icon: Moon,
    },
    {
      id: 'system',
      label: t('settings.generated.theoHeThongSystem'),
      description: t('settings.generated.tuDongDongBoTheoCaiDatGiaoDien'),
      icon: Laptop,
    },
  ]

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold">{t('settings.generated.giaoDienTheme')}</CardTitle>
        <CardDescription className="text-xs">
          {t('settings.generated.luaChonCheDoHienThiSangHoacToi')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((item) => {
            const Icon = item.icon
            const isChecked = theme === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`flex flex-col text-left gap-1 rounded-lg border p-3.5 transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                    : 'border-border/80 hover:bg-muted/40 hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-7 rounded-md flex items-center justify-center ${
                      isChecked
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {item.description}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
