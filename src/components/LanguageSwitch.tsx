'use client'
import { LANG_COOKIE, type Locale } from '@/lib/i18n-shared'

// Add a language here (and to Locale / the dictionaries) and it shows up in Settings.
const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export function LanguageSwitch({ locale }: { locale: Locale }) {
  function pick(next: Locale) {
    if (next === locale) return
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax${secure}`
    window.location.reload()
  }
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => pick(code)}
          aria-pressed={locale === code}
          className="px-4 py-2 rounded-full border-2 border-ink text-sm font-extrabold transition-opacity hover:opacity-80"
          style={locale === code ? { background: 'var(--ink)', color: 'var(--paper)' } : { background: 'transparent', color: 'rgba(17,17,17,0.7)' }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
