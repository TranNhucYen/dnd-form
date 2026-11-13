'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/config'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  supportedLocales,
  type AppLocale,
} from '@/i18n/resources'

function isAppLocale(value: string | null): value is AppLocale {
  return value !== null && supportedLocales.includes(value as AppLocale)
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let savedLocale: string | null = null
    try {
      savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
    } catch {
      // Dùng tiếng Việt mặc định nếu không thể truy cập local storage
    }
    const locale: AppLocale = isAppLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE
    document.documentElement.lang = locale
    void i18n.changeLanguage(locale)
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
