'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    onTelegramAuth: (user: Record<string, unknown>) => void
  }
}

export function TelegramLoginButton({ label = 'Войти через Telegram' }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
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

    return () => { delete window.onTelegramAuth }
  }, [router])

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div ref={ref} className="w-full flex justify-center" />
      <p className="text-xs text-ink/30 font-semibold">{label}</p>
    </div>
  )
}
