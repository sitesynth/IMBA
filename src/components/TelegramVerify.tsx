'use client'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api-client'
import { getFingerprint } from '@/lib/fingerprint'

interface Props {
  onActivated: () => void
}

export function TelegramVerify({ onActivated }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      setLoading(true)
      setError('')
      try {
        const fingerprint = await getFingerprint()
        const res = await api.post<{ ok: boolean; vpn_activated: boolean; vpn_trial_days?: number }>(
          '/v1/me/telegram/link',
          { ...user, fingerprint }
        )
        setDone(true)
        if (res.vpn_activated) setTimeout(onActivated, 1200)
      } catch (e: unknown) {
        setError((e as { message?: string })?.message || 'Ошибка привязки Telegram')
      } finally {
        setLoading(false)
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

    return () => { ;(window as any).onTelegramAuth = undefined }
  }, [onActivated])

  if (done) {
    return (
      <p className="text-xs font-bold mt-4 mb-1 relative z-10" style={{ color: 'var(--green)' }}>
        VPN 7 дней + eSIM 500 МБ активированы!
      </p>
    )
  }

  return (
    <div className="mt-4 relative z-10">
      <p className="text-xs font-semibold text-white/50 mb-2">
        Подтверди Telegram → получи 7 дней VPN + eSIM 500 МБ бесплатно
      </p>
      {loading ? (
        <p className="text-xs text-white/40 font-semibold">Активируем…</p>
      ) : (
        <div ref={ref} />
      )}
      {error && <p className="text-xs font-bold text-red-400 mt-1.5">{error}</p>}
    </div>
  )
}
