'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tag } from 'lucide-react'
import { getFingerprint } from '@/lib/fingerprint'

export function VpnPromoInput({ locale }: { locale: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (window.location.hash === '#promo') {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  async function redeem() {
    if (!code.trim() || state === 'loading') return
    setState('loading')
    const fp = await getFingerprint()
    try {
      const params = new URLSearchParams({ code: code.trim(), ...(fp ? { fingerprint: fp } : {}) })
      const res = await fetch(`/api/action/redeem-promo?${params}`, { method: 'GET' })
      const data = await res.json()
      if (!res.ok) {
        setState('error')
        setMsg(data.detail || (locale === 'ru' ? 'Неверный промокод' : 'Invalid promo code'))
        return
      }
      setState('ok')
      if (data.vpn_trial_days) {
        setMsg(locale === 'ru' ? `VPN продлён на ${data.vpn_trial_days} дней!` : `VPN extended by ${data.vpn_trial_days} days!`)
      } else {
        setMsg(`+$${data.credited?.toFixed(2)}`)
      }
      setTimeout(() => router.refresh(), 1500)
    } catch {
      setState('error')
      setMsg(locale === 'ru' ? 'Ошибка сети' : 'Network error')
    }
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-ink/20 bg-white">
          <Tag className="w-4 h-4 text-ink/30 shrink-0" strokeWidth={2.5} />
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && redeem()}
            placeholder={locale === 'ru' ? 'Купон / промокод' : 'Coupon / promo code'}
            className="bg-transparent text-ink placeholder-ink/30 font-extrabold text-sm w-full outline-none tracking-widest"
          />
        </div>
        <button
          onClick={redeem}
          disabled={state === 'loading' || !code.trim()}
          className="pill pill-ink pill-sm shrink-0 disabled:opacity-40"
        >
          {state === 'loading' ? '…' : state === 'ok' ? '✓' : (locale === 'ru' ? 'Применить' : 'Apply')}
        </button>
      </div>
      {(state === 'ok' || state === 'error') && msg && (
        <p className="text-xs font-bold mt-1.5" style={{ color: state === 'ok' ? '#0a7c4e' : '#c0392b' }}>
          {msg}
        </p>
      )}
    </div>
  )
}
