import { cookies, headers } from 'next/headers'
import type { Locale } from './i18n-shared'
import { getLocaleFromHost, resolveLocale, LANG_COOKIE } from './i18n-shared'

export type { Locale } from './i18n-shared'
export { getLocaleFromHost, getDateLocale, pluralDays } from './i18n-shared'

export async function getLocale(): Promise<Locale> {
  const h = await headers()
  const host = (h.get('x-real-host') ?? h.get('x-forwarded-host') ?? h.get('host') ?? '').toLowerCase()
  const chosen = (await cookies()).get(LANG_COOKIE)?.value
  return resolveLocale(host, chosen)
}
