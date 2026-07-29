'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const locale = useLocale()
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return
    try { if (localStorage.getItem('pwa_dismissed')) return } catch {}

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!prompt || dismissed) return null

  async function install() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'dismissed') {
      try { localStorage.setItem('pwa_dismissed', '1') } catch {}
    }
    setDismissed(true)
  }

  function dismiss() {
    try { localStorage.setItem('pwa_dismissed', '1') } catch {}
    setDismissed(true)
  }

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl"
      style={{ background: 'var(--violet-100)', border: '2px solid var(--ink)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <img src="/favicon.png" alt="IMBA" className="w-9 h-9 rounded-xl shrink-0" />
        <div className="min-w-0">
          <p className="font-extrabold text-sm leading-tight">{t('install.heading', locale)}</p>
          <p className="text-xs font-semibold opacity-50 leading-tight">{t('install.desc', locale)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={install}
          className="pill pill-ink pill-sm"
          style={{ gap: 4 }}>
          <Plus className="w-3.5 h-3.5" strokeWidth={3} /> {t('install.add', locale)}
        </button>
        <button onClick={dismiss}
          className="text-ink/30 hover:text-ink/60 transition-colors text-lg font-bold leading-none"
          aria-label={t('nav.close', locale)}>×</button>
      </div>
    </div>
  )
}
