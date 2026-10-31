'use client'

import { useContext, useMemo } from 'react'
import { type Locale, getLocaleFromHost } from './i18n-shared'
import { LocaleContext } from './locale-context'

export function useLocale(): Locale {
  const fromContext = useContext(LocaleContext)
  const fromHost = useMemo(() => {
    if (typeof window === 'undefined') return 'en'
    return getLocaleFromHost(window.location.hostname)
  }, [])
  return fromContext ?? fromHost
}
