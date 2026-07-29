'use client'

import { useMemo } from 'react'
import { type Locale, getLocaleFromHost } from './i18n-shared'

export function useLocale(): Locale {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'en'
    return getLocaleFromHost(window.location.hostname)
  }, [])
}
