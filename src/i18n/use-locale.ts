'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, supportedLocales, type AppLocale } from './resources';

function isAppLocale(value: string | undefined): value is AppLocale {
  return value !== undefined && supportedLocales.includes(value as AppLocale);
}

export function useLocale() {
  const { i18n } = useTranslation();
  const locale = isAppLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;

  const setLocale = useCallback(
    (nextLocale: AppLocale) => {
      document.documentElement.lang = nextLocale;
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      } catch {
        // Vẫn đổi ngôn ngữ trong phiên hiện tại nếu local storage không dùng được.
      }
      void i18n.changeLanguage(nextLocale);
    },
    [i18n],
  );

  return { locale, setLocale };
}
