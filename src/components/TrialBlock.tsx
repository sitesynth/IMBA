'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tag, ArrowRight } from 'lucide-react'
import { VKIDButton } from './VKIDButton'
import { getFingerprint } from '@/lib/fingerprint'

const VK_GROUP_URL = 'https://vk.com/club239876488'
const TG_CHANNEL_URL = 'https://t.me/imba_live'

type Method = 'vk' | 'tg' | null
type VKPhase = 'idle' | 'join'
type TGPhase = 'idle' | 'open'

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

  useEffect(() => {
    if (searchParams.get('trial_vk') === 'join') { setMethod('vk'); setVkPhase('join') }
    if (searchParams.get('activated') === 'trial') { onActivated() }
  }, [])

  function selectMethod(m: Method) {
    setMethod(prev => prev === m ? null : m)
    setVkError('')
  }

  async function recheckVK() {
    setVkChecking(true); setVkError('')
    try {
      let token = '', vkId = ''
      try { token = sessionStorage.getItem('vk_trial_token') || ''; vkId = sessionStorage.getItem('vk_trial_id') || '' } catch {}
      if (!token || !vkId) { setVkError('Авторизуйся через VK ещё раз'); return }
      const fp = await getFingerprint()
      const res = await fetch('/api/v1/me/trial/activate-vk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ vk_id: Number(vkId), access_token: token, fingerprint: fp }),
      })
      if (res.status === 403) { setVkError('Ещё не вступил в группу. Вступи и попробуй снова.'); return }
      if (!res.ok) { const e = await res.json().catch(() => ({})); setVkError(e.detail || 'Ошибка'); return }
      try { sessionStorage.removeItem('vk_trial_token'); sessionStorage.removeItem('vk_trial_id') } catch {}
      onActivated()
    } finally { setVkChecking(false) }
  }

  async function startTG() {
    setTgLoading(true)
    try {
      const res = await fetch('/api/v1/me/trial/tg-link', { method: 'POST', credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setTgBotUrl(data.bot_url)
      setTgPhase('open')
    } finally { setTgLoading(false) }
  }

  async function redeemPromo() {
    if (!promoCode.trim() || promoState === 'loading') return
    setPromoState('loading')
    const fp = await getFingerprint()
    try {
      const res = await fetch('/api/v1/me/promo/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ code: promoCode.trim(), fingerprint: fp }),
      })
      const data = await res.json()
      if (!res.ok) { setPromoState('error'); setPromoMsg(data.detail || 'Ошибка'); return }
      setPromoState('ok')
      const msg = data.vpn_trial_days ? `VPN ${data.vpn_trial_days} дн + eSIM активированы!` : `+$${data.credited?.toFixed(2)} зачислено!`
      setPromoMsg(msg); onPromoApplied(msg)
    } catch { setPromoState('error'); setPromoMsg('Ошибка сети') }
  }

  // Compact pill style
  const pillVk: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
    borderRadius: 999, border: `2px solid ${method === 'vk' ? '#FFD731' : 'rgba(255,255,255,0.18)'}`,
    background: method === 'vk' ? 'rgba(255,215,49,0.1)' : 'transparent',
    opacity: method === 'tg' ? 0.3 : 1,
    pointerEvents: method === 'tg' ? 'none' : 'auto',
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' as const,
    color: method === 'vk' ? '#FFD731' : 'rgba(255,255,255,0.75)',
    fontSize: 12, fontWeight: 800,
  }
  const pillTg: React.CSSProperties = {
    ...pillVk,
    border: `2px solid ${method === 'tg' ? '#FFD731' : 'rgba(255,255,255,0.18)'}`,
    background: method === 'tg' ? 'rgba(255,215,49,0.1)' : 'transparent',
    opacity: method === 'vk' ? 0.3 : 1,
    pointerEvents: method === 'vk' ? 'none' : 'auto',
    color: method === 'tg' ? '#FFD731' : 'rgba(255,255,255,0.75)',
  }

  return (
    <div className="relative z-10" style={{ marginTop: 18 }}>

      {/* One-line row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Globe + label */}
        <div className="flex items-center gap-1.5 mr-1">
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="14" cy="14" r="12" stroke="#FFD731" strokeWidth="2"/>
            <ellipse cx="14" cy="14" rx="5" ry="12" stroke="#FFD731" strokeWidth="2"/>
            <line x1="2" y1="14" x2="26" y2="14" stroke="#FFD731" strokeWidth="2"/>
            <line x1="4" y1="8" x2="24" y2="8" stroke="#FFD731" strokeWidth="1.5"/>
            <line x1="4" y1="20" x2="24" y2="20" stroke="#FFD731" strokeWidth="1.5"/>
          </svg>
          <span style={{ color: '#FFD731', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            7 дней VPN + eSIM
          </span>
        </div>

        {/* VK pill */}
        <button style={pillVk} onClick={() => selectMethod('vk')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.1-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
          </svg>
          ВКонтакте
        </button>

        {/* TG pill */}
        <button style={pillTg} onClick={() => selectMethod('tg')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.31 14.42l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.843.139z"/>
          </svg>
          Telegram
        </button>

        {/* Divider */}
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>или</span>

        {/* Promo inline */}
        <div className="flex flex-1 min-w-0 items-center gap-1.5"
          style={{ border: '2px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '5px 12px', background: 'rgba(255,255,255,0.06)', minWidth: 120 }}>
          <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} strokeWidth={2.5} />
          <input
            ref={promoRef}
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && redeemPromo()}
            placeholder="Промокод"
            className="bg-transparent text-white placeholder-white/25 font-extrabold text-xs w-full outline-none tracking-widest"
          />
        </div>
        <button
          onClick={redeemPromo}
          disabled={promoState === 'loading' || !promoCode.trim()}
          style={{
            background: promoState === 'ok' ? '#55DB9C' : '#FFD731', color: '#111',
            border: 'none', borderRadius: 999, padding: '7px 14px',
            fontSize: 12, fontWeight: 800, cursor: 'pointer', flexShrink: 0,
            opacity: (!promoCode.trim() || promoState === 'loading') ? 0.4 : 1,
          }}
        >
          {promoState === 'loading' ? '…' : promoState === 'ok' ? '✓' : <ArrowRight className="w-4 h-4" strokeWidth={3} />}
        </button>
      </div>

      {/* Promo feedback */}
      {(promoState === 'ok' || promoState === 'error') && promoMsg && (
        <p className="text-xs font-bold mt-1" style={{ color: promoState === 'ok' ? '#55DB9C' : '#f87171' }}>{promoMsg}</p>
      )}

      {/* VK expanded */}
      {method === 'vk' && (
        <div className="mt-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,215,49,0.2)' }}>
          {vkPhase === 'idle' ? (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Войди через VK → вступи в группу IMBA → получи триал
              </p>
              <VKIDButton mode="trial" onError={(m) => setVkError(m)} />
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <a href={VK_GROUP_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: '#2787F5', color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                Открыть группу →
              </a>
              <button onClick={recheckVK} disabled={vkChecking}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: '#FFD731', color: '#111', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', opacity: vkChecking ? 0.5 : 1 }}>
                {vkChecking ? 'Проверяем…' : 'Я вступил → Активировать'}
              </button>
            </div>
          )}
          {vkError && <p className="text-xs font-bold mt-2" style={{ color: '#f87171' }}>{vkError}</p>}
        </div>
      )}

      {/* TG expanded */}
      {method === 'tg' && (
        <div className="mt-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,215,49,0.2)' }}>
          {tgPhase === 'idle' ? (
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Подпишись на канал и подтверди через бота</p>
              <button onClick={startTG} disabled={tgLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: '#2AABEE', color: '#fff', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', opacity: tgLoading ? 0.5 : 1 }}>
                {tgLoading ? '…' : 'Начать →'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <a href={TG_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: '#2AABEE', color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                1. Подписаться на канал →
              </a>
              <a href={tgBotUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: '#FFD731', color: '#111', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                2. Подтвердить в боте →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ code: code.trim(), fingerprint: fp }),
      })
      const data = await res.json()
      if (!res.ok) { setState('error'); setMsg(data.detail || 'Неверный промокод'); return }
      setState('ok')
      setMsg(data.vpn_trial_days ? `VPN ${data.vpn_trial_days} дн активированы!` : `+$${data.credited?.toFixed(2)} зачислено!`)
    } catch { setState('error'); setMsg('Ошибка сети') }
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
        <button onClick={redeem} disabled={state === 'loading' || !code.trim()}
          className="pill pill-yellow pill-sm shrink-0 disabled:opacity-40">
          {state === 'loading' ? '…' : state === 'ok' ? '✓' : 'Применить'}
        </button>
      </div>
      {(state === 'ok' || state === 'error') && msg && (
        <p className="text-xs font-bold mt-1.5" style={{ color: state === 'ok' ? '#55DB9C' : '#f87171' }}>{msg}</p>
      )}
    </div>
  )
}
