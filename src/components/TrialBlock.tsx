'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tag } from 'lucide-react'
import { VKIDButton } from './VKIDButton'
import { getFingerprint } from '@/lib/fingerprint'

export function PromoInputRow() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function redeem() {
    if (!code.trim() || state === 'loading') return
    setState('loading')
    const fp = await getFingerprint()
    try {
      const res = await fetch('/api/v1/me/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: code.trim(), fingerprint: fp }),
      })
      const data = await res.json()
      if (!res.ok) { setState('error'); setMsg(data.detail || 'Неверный промокод'); return }
      setState('ok')
      setMsg(data.vpn_trial_days ? `VPN ${data.vpn_trial_days} дн + eSIM активированы!` : `+$${data.credited?.toFixed(2)} зачислено!`)
    } catch {
      setState('error')
      setMsg('Ошибка сети')
    }
  }

  return (
    <div className="mt-4 relative z-10">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-white/20 bg-white/10">
          <Tag className="w-4 h-4 text-white/40 shrink-0" strokeWidth={2.5} />
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && redeem()}
            placeholder="Промокод"
            className="bg-transparent text-white placeholder-white/30 font-extrabold text-sm w-full outline-none tracking-widest"
          />
        </div>
        <button
          onClick={redeem}
          disabled={state === 'loading' || !code.trim()}
          className="pill pill-yellow pill-sm shrink-0 disabled:opacity-40"
        >
          {state === 'loading' ? '…' : state === 'ok' ? '✓' : 'Применить'}
        </button>
      </div>
      {(state === 'ok' || state === 'error') && msg && (
        <p className="text-xs font-bold mt-1.5" style={{ color: state === 'ok' ? '#55DB9C' : '#f87171' }}>{msg}</p>
      )}
    </div>
  )
}

const VK_GROUP_URL = 'https://vk.com/club239876488'
const TG_CHANNEL_URL = 'https://t.me/imba_live'

type Method = 'vk' | 'tg' | null
type VKPhase = 'idle' | 'join'
type TGPhase = 'idle' | 'subscribe' | 'confirm'

interface Props {
  onActivated: () => void
  onPromoApplied: (msg: string) => void
}

export function TrialBlock({ onActivated, onPromoApplied }: Props) {
  const searchParams = useSearchParams()
  const promoRef = useRef<HTMLInputElement>(null)

  const [method, setMethod] = useState<Method>(null)
  const [vkPhase, setVkPhase] = useState<VKPhase>('idle')
  const [tgPhase, setTgPhase] = useState<TGPhase>('idle')
  const [tgBotUrl, setTgBotUrl] = useState('')
  const [tgLoading, setTgLoading] = useState(false)
  const [vkError, setVkError] = useState('')
  const [vkChecking, setVkChecking] = useState(false)

  const [promoCode, setPromoCode] = useState('')
  const [promoState, setPromoState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [promoMsg, setPromoMsg] = useState('')

  // Handle redirect back from VK OAuth
  useEffect(() => {
    const trialVk = searchParams.get('trial_vk')
    if (trialVk === 'join') {
      setMethod('vk')
      setVkPhase('join')
    }
    if (searchParams.get('activated') === 'trial') {
      onActivated()
    }
  }, [])

  function selectMethod(m: Method) {
    setMethod(prev => prev === m ? null : m)
    setVkError('')
  }

  // VK: re-check after joining group
  async function recheckVK() {
    setVkChecking(true)
    setVkError('')
    try {
      let token = ''
      let vkId = ''
      try { token = sessionStorage.getItem('vk_trial_token') || ''; vkId = sessionStorage.getItem('vk_trial_id') || '' } catch {}
      if (!token || !vkId) { setVkError('Авторизуйся через VK ещё раз'); return }
      const fp = await getFingerprint()
      const res = await fetch('/api/v1/me/trial/activate-vk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vk_id: Number(vkId), access_token: token, fingerprint: fp }),
      })
      if (res.status === 403) { setVkError('Ты ещё не вступил в группу. Вступи и попробуй снова.'); return }
      if (!res.ok) { const e = await res.json().catch(() => ({})); setVkError(e.detail || 'Ошибка'); return }
      try { sessionStorage.removeItem('vk_trial_token'); sessionStorage.removeItem('vk_trial_id') } catch {}
      onActivated()
    } finally {
      setVkChecking(false)
    }
  }

  // TG: get bot link
  async function startTG() {
    setTgLoading(true)
    try {
      const res = await fetch('/api/v1/me/trial/tg-link', { method: 'POST', credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setTgBotUrl(data.bot_url)
      setTgPhase('subscribe')
    } finally {
      setTgLoading(false)
    }
  }

  // Promo
  async function redeemPromo() {
    if (!promoCode.trim() || promoState === 'loading') return
    setPromoState('loading')
    const fp = await getFingerprint()
    try {
      const res = await fetch('/api/v1/me/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: promoCode.trim(), fingerprint: fp }),
      })
      const data = await res.json()
      if (!res.ok) { setPromoState('error'); setPromoMsg(data.detail || 'Ошибка'); return }
      setPromoState('ok')
      const msg = data.vpn_trial_days ? `VPN ${data.vpn_trial_days} дн + eSIM 500 МБ активированы!` : `+$${data.credited?.toFixed(2)} зачислено!`
      setPromoMsg(msg)
      onPromoApplied(msg)
    } catch {
      setPromoState('error')
      setPromoMsg('Ошибка сети')
    }
  }

  const btnBase: React.CSSProperties = {
    flex: 1, padding: '14px 16px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.15)',
    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' as const,
  }
  const btnActive: React.CSSProperties = { ...btnBase, border: '2px solid #FFD731', background: 'rgba(255,215,49,0.08)' }
  const btnDim: React.CSSProperties = { ...btnBase, opacity: 0.35, pointerEvents: 'none' }

  return (
    <div className="relative z-10" style={{ marginTop: 20 }}>

      {/* Heading */}
      <div className="flex items-center gap-2 mb-3">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#FFD731" strokeWidth="2"/>
          <ellipse cx="14" cy="14" rx="5" ry="12" stroke="#FFD731" strokeWidth="2"/>
          <line x1="2" y1="14" x2="26" y2="14" stroke="#FFD731" strokeWidth="2"/>
          <line x1="4" y1="8" x2="24" y2="8" stroke="#FFD731" strokeWidth="1.5"/>
          <line x1="4" y1="20" x2="24" y2="20" stroke="#FFD731" strokeWidth="1.5"/>
        </svg>
        <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#FFD731' }}>
          7 дней вокруг света
        </span>
      </div>
      <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Вступи в сообщество — получи VPN + eSIM 500 МБ бесплатно
      </p>

      {/* Method cards */}
      <div className="flex gap-2 mb-3">

        {/* VK card */}
        <button
          style={method === 'tg' ? btnDim : method === 'vk' ? btnActive : btnBase}
          onClick={() => selectMethod('vk')}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={method === 'vk' ? '#FFD731' : 'rgba(255,255,255,0.7)'}>
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.1-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
            </svg>
            <span className="text-xs font-extrabold" style={{ color: method === 'vk' ? '#FFD731' : 'rgba(255,255,255,0.7)' }}>ВКонтакте</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>Вступи в группу IMBA</p>
        </button>

        {/* TG card */}
        <button
          style={method === 'vk' ? btnDim : method === 'tg' ? btnActive : btnBase}
          onClick={() => selectMethod('tg')}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={method === 'tg' ? '#FFD731' : 'rgba(255,255,255,0.7)'}>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.31 14.42l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.843.139z"/>
            </svg>
            <span className="text-xs font-extrabold" style={{ color: method === 'tg' ? '#FFD731' : 'rgba(255,255,255,0.7)' }}>Telegram</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>Подпишись на канал</p>
        </button>
      </div>

      {/* VK expanded */}
      {method === 'vk' && (
        <div className="mb-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,215,49,0.2)' }}>
          {vkPhase === 'idle' ? (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                1. Авторизуйся через VK<br/>2. Вступи в группу IMBA
              </p>
              <VKIDButton mode="trial" onError={(m) => setVkError(m)} />
            </>
          ) : (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Вступи в группу, затем нажми кнопку ниже
              </p>
              <a href={VK_GROUP_URL} target="_blank" rel="noopener noreferrer"
                className="pill pill-sm mb-2"
                style={{ display: 'inline-flex', background: '#2787F5', color: '#fff', borderColor: 'transparent' }}>
                Открыть группу IMBA →
              </a>
              <br />
              <button onClick={recheckVK} disabled={vkChecking}
                className="pill pill-sm disabled:opacity-50"
                style={{ background: '#FFD731', color: '#111', borderColor: 'transparent' }}>
                {vkChecking ? 'Проверяем…' : 'Я вступил → Активировать'}
              </button>
            </>
          )}
          {vkError && <p className="text-xs font-bold mt-2" style={{ color: '#f87171' }}>{vkError}</p>}
        </div>
      )}

      {/* TG expanded */}
      {method === 'tg' && (
        <div className="mb-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,215,49,0.2)' }}>
          {tgPhase === 'idle' && (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                1. Подпишись на Telegram-канал IMBA<br/>2. Подтверди через бота
              </p>
              <button onClick={startTG} disabled={tgLoading}
                className="pill pill-sm disabled:opacity-50"
                style={{ background: '#2AABEE', color: '#fff', borderColor: 'transparent' }}>
                {tgLoading ? 'Загрузка…' : 'Начать →'}
              </button>
            </>
          )}
          {tgPhase === 'subscribe' && (
            <>
              <a href={TG_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className="pill pill-sm mb-2"
                style={{ display: 'inline-flex', background: '#2AABEE', color: '#fff', borderColor: 'transparent' }}>
                1. Открыть канал IMBA →
              </a>
              <br/>
              <a href={tgBotUrl} target="_blank" rel="noopener noreferrer"
                className="pill pill-sm"
                style={{ display: 'inline-flex', background: '#FFD731', color: '#111', borderColor: 'transparent' }}>
                2. Подтвердить в боте →
              </a>
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Бот проверит подписку и активирует триал
              </p>
            </>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-2 mb-3">
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>или промокод</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* Promo code */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{ border: '2px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)' }}>
          <Tag className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} strokeWidth={2.5} />
          <input
            ref={promoRef}
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && redeemPromo()}
            placeholder="Промокод"
            className="bg-transparent text-white placeholder-white/25 font-extrabold text-sm w-full outline-none tracking-widest"
          />
        </div>
        <button
          onClick={redeemPromo}
          disabled={promoState === 'loading' || !promoCode.trim()}
          className="pill pill-sm disabled:opacity-40"
          style={{ background: promoState === 'ok' ? '#55DB9C' : '#FFD731', color: '#111', borderColor: 'transparent', whiteSpace: 'nowrap' }}
        >
          {promoState === 'loading' ? '…' : promoState === 'ok' ? '✓' : 'Применить'}
        </button>
      </div>
      {(promoState === 'ok' || promoState === 'error') && promoMsg && (
        <p className="text-xs font-bold mt-1.5" style={{ color: promoState === 'ok' ? '#55DB9C' : '#f87171' }}>
          {promoMsg}
        </p>
      )}
    </div>
  )
}
