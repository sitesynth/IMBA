import { headers } from 'next/headers'
import type { Locale } from './i18n-shared'
import { getLocaleFromHost } from './i18n-shared'

export type { Locale } from './i18n-shared'
export { getLocaleFromHost, getDateLocale, pluralDays } from './i18n-shared'

export async function getLocale(): Promise<Locale> {
  const h = await headers()
  const host = (h.get('x-real-host') ?? h.get('x-forwarded-host') ?? h.get('host') ?? '').toLowerCase()
  return getLocaleFromHost(host)
}
