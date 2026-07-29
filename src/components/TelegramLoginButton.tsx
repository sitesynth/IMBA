'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getFingerprint } from '@/lib/fingerprint'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, unknown>) => void
  }
}

export function TelegramLoginButton({ label }: { label?: string }) {
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const resolvedLabel = label ?? t('auth.tg_login', locale)

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      const fingerprint = await getFingerprint()
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, fingerprint }),
      })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    }

    if (!ref.current || ref.current.querySelector('script')) return
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'imba_live_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '20')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    ref.current.appendChild(script)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { ;(window as any).onTelegramAuth = undefined }
  }, [router])

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div ref={ref} className="w-full flex justify-center" />
      <p className="text-xs text-ink/30 font-semibold">{resolvedLabel}</p>
    </div>
  )
}
