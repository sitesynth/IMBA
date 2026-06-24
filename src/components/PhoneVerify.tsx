'use client'
import { useState } from 'react'
import { Phone, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api-client'

interface Props {
  onActivated: () => void
}

export function PhoneVerify({ onActivated }: Props) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code' | 'done'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendCode() {
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    try {
      await api.post('/v1/me/phone/send-code', { phone })
      setStep('code')
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || 'Ошибка отправки SMS')
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    if (code.length < 4) return
    setLoading(true)
    setError('')
    try {
      const res = await api.post<{ ok: boolean; vpn_activated: boolean }>('/v1/me/phone/verify', { phone, code })
      setStep('done')
      if (res.vpn_activated) setTimeout(onActivated, 1200)
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || 'Неверный код')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <p className="text-xs font-bold mt-4 mb-1 relative z-10" style={{ color: 'var(--green)' }}>
        VPN 7 дней + eSIM 500 МБ активированы!
      </p>
    )
  }

  return (
    <div className="mt-4 relative z-10">
      <p className="text-xs font-semibold text-white/50 mb-2">
        {step === 'phone'
          ? 'Подтверди номер телефона → получи 7 дней VPN + eSIM 500 МБ бесплатно'
          : `SMS с кодом отправлен на ${phone}`}
      </p>
      <div className="flex gap-2">
        {step === 'phone' ? (
          <>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-white/20 bg-white/10">
              <Phone className="w-4 h-4 text-white/40 shrink-0" strokeWidth={2} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                placeholder="+7 900 000-00-00"
                className="bg-transparent text-white placeholder-white/30 font-semibold text-sm w-full outline-none"
              />
            </div>
            <button
              onClick={sendCode}
              disabled={loading || !phone.trim()}
              className="pill pill-yellow pill-sm shrink-0"
            >
              {loading ? '...' : 'Получить код'}
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-white/20 bg-white/10">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && verify()}
                placeholder="000000"
                maxLength={6}
                autoFocus
                className="bg-transparent text-white placeholder-white/30 font-extrabold text-lg tracking-[0.3em] w-full outline-none text-center"
              />
            </div>
            <button
              onClick={verify}
              disabled={loading || code.length < 4}
              className="pill pill-yellow pill-sm shrink-0"
            >
              {loading ? '...' : <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
            </button>
          </>
        )}
      </div>
      {error && <p className="text-xs font-bold text-red-400 mt-1.5">{error}</p>}
      {step === 'code' && (
        <button
          onClick={() => { setStep('phone'); setCode(''); setError('') }}
          className="text-xs text-white/30 mt-2 hover:text-white/60 transition-colors"
        >
          Изменить номер
        </button>
      )}
    </div>
  )
}
