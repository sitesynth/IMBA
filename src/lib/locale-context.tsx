'use client'
import { createContext } from 'react'
import type { Locale } from './i18n-shared'

// Locale chosen on the server (cookie, else host) so client components render the same language as SSR.
export const LocaleContext = createContext<Locale | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}
