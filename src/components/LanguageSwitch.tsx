'use client'
import { LANG_COOKIE, type Locale } from '@/lib/i18n-shared'

export function LanguageSwitch({ locale }: { locale: Locale }) {
  function pick(next: Locale) {
    if (next === locale) return
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax${secure}`
    window.location.reload()
  }
  return (
    <div className="inline-flex rounded-full border-2 border-ink overflow-hidden text-xs font-extrabold" role="group" aria-label="Language">
      {(['en', 'ru'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => pick(l)}
          aria-pressed={locale === l}
          className="px-3 py-1.5 transition-colors hover:opacity-80"
          style={locale === l ? { background: 'var(--ink)', color: 'var(--paper)' } : { color: 'rgba(17,17,17,0.6)' }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
