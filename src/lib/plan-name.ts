import type { Locale } from './i18n-shared'

// The backend stores plan names in Russian ('Старт', 'Про', ...). Map them to the
// UI language so the English site doesn't show a Russian label; unknown names pass through.
const PLAN_NAMES: Record<string, { ru: string; en: string }> = {
  'старт': { ru: 'Старт', en: 'Start' },
  'start': { ru: 'Старт', en: 'Start' },
  'про': { ru: 'Про', en: 'Pro' },
  'pro': { ru: 'Про', en: 'Pro' },
  'бизнес': { ru: 'Бизнес', en: 'Business' },
  'business': { ru: 'Бизнес', en: 'Business' },
}

export function planLabel(name: string | null | undefined, locale: Locale): string {
  if (!name) return ''
  const hit = PLAN_NAMES[name.trim().toLowerCase()]
  return hit ? hit[locale === 'ru' ? 'ru' : 'en'] : name
}
