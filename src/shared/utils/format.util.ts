export type Locale = 'vi' | 'en'

const LOCALE_MAP: Record<Locale, string> = {
  vi: 'vi-VN',
  en: 'en-US',
}

const DEFAULT_LOCALE: Locale = 'vi'

// Nhận 'vi' | 'en' hoặc mã Intl bất kỳ (vd: 'en-GB')
function resolveLocale(locale: Locale | string = DEFAULT_LOCALE): string {
  return LOCALE_MAP[locale as Locale] ?? locale
}

/**
 * Định dạng số theo locale (mặc định vi).
 * @example formatNumber(1234567) // '1.234.567'
 * @example formatNumber(1234567, '0', 'en') // '1,234,567'
 */
export function formatNumber(
  value: number | string | null | undefined,
  defaultValue: string = '0',
  locale: Locale | string = DEFAULT_LOCALE
): string {
  if (value === null || value === undefined || value === '') return defaultValue
  const num = typeof value === 'string' ? Number(value) : value
  if (isNaN(num)) return defaultValue
  return num.toLocaleString(resolveLocale(locale))
}

/**
 * Định dạng ngày theo locale (mặc định vi). Nhận Date, chuỗi ISO hoặc timestamp.
 * @example formatDate(new Date()) // '09/10/2026'
 * @example formatDate(new Date(), undefined, '', 'en') // '10/9/2026'
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback: string = '',
  locale: Locale | string = DEFAULT_LOCALE
): string {
  if (!date) return fallback
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return fallback
  return d.toLocaleDateString(resolveLocale(locale), options)
}