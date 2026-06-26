'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tag } from 'lucide-react'
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
  const [hoveredVk, setHoveredVk] = useState(false)
  const [hoveredTg, setHoveredTg] = useState(false)
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
      if (res.status === 403) { setVkError('Ещё не вступил. Вступи в группу и попробуй снова.'); return }
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

  function cardStyle(m: 'vk' | 'tg'): React.CSSProperties {
    const active = method === m
    const hovered = m === 'vk' ? hoveredVk : hoveredTg
    const dimmed = method !== null && method !== m
    return {
      flex: 1,
      padding: '14px 16px',
      borderRadius: 16,
      border: active
        ? '2px solid #FFD731'
        : hovered
        ? '2px solid rgba(255,255,255,0.45)'
        : '2px solid rgba(255,255,255,0.13)',
      background: active ? 'rgba(255,215,49,0.07)' : 'transparent',
      opacity: dimmed ? 0.3 : 1,
      pointerEvents: dimmed ? 'none' : 'auto',
      cursor: 'pointer',
      transition: 'border-color 0.12s, opacity 0.12s, background 0.12s',
      textAlign: 'left' as const,
    }
  }

  return (
    <div className="relative z-10" style={{ marginTop: 20 }}>

      {/* Heading */}
      <div className="flex items-center gap-2 mb-2">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="14" cy="14" r="12" stroke="#FFD731" strokeWidth="2"/>
          <ellipse cx="14" cy="14" rx="5" ry="12" stroke="#FFD731" strokeWidth="2"/>
          <line x1="2" y1="14" x2="26" y2="14" stroke="#FFD731" strokeWidth="2"/>
          <line x1="4" y1="8" x2="24" y2="8" stroke="#FFD731" strokeWidth="1.5"/>
          <line x1="4" y1="20" x2="24" y2="20" stroke="#FFD731" strokeWidth="1.5"/>
        </svg>
        <span style={{ color: '#FFD731', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          7 дней вокруг света
        </span>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, marginBottom: 14, lineHeight: 1.45 }}>
        Выбери ВКонтакте или Telegram, подпишись на наши соцсети и активируй IMBA Старт: VPN и eSIM 500 МБ на 7 дней!
      </p>

      {/* Method cards */}
      <div className="flex gap-2 mb-3">
        <button
          style={cardStyle('vk')}
          onClick={() => selectMethod('vk')}
          onMouseEnter={() => setHoveredVk(true)}
          onMouseLeave={() => setHoveredVk(false)}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={method === 'vk' ? '#FFD731' : 'rgba(255,255,255,0.7)'}>
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.1-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 800, color: method === 'vk' ? '#FFD731' : 'rgba(255,255,255,0.8)' }}>ВКонтакте</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.3, margin: 0 }}>Вступи в группу IMBA</p>
        </button>

        <button
          style={cardStyle('tg')}
          onClick={() => selectMethod('tg')}
          onMouseEnter={() => setHoveredTg(true)}
          onMouseLeave={() => setHoveredTg(false)}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={method === 'tg' ? '#FFD731' : 'rgba(255,255,255,0.7)'}>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.31 14.42l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.843.139z"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 800, color: method === 'tg' ? '#FFD731' : 'rgba(255,255,255,0.8)' }}>Telegram</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.3, margin: 0 }}>Подпишись на канал</p>
        </button>
      </div>

      {/* VK expanded */}
      {method === 'vk' && (
        <div className="mb-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,215,49,0.18)' }}>
          {vkPhase === 'idle' ? (
            <>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                Войди через VK и вступи в группу IMBA
              </p>
              <VKIDButton mode="trial" onError={(m) => setVkError(m)} />
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <a href={VK_GROUP_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: '#2787F5', color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                Открыть группу →
              </a>
              <button onClick={recheckVK} disabled={vkChecking}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 999, background: '#FFD731', color: '#111', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', opacity: vkChecking ? 0.5 : 1 }}>
                {vkChecking ? 'Проверяем…' : 'Я вступил → Активировать'}
              </button>
            </div>
          )}
          {vkError && <p style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginTop: 8 }}>{vkError}</p>}
        </div>
      )}

      {/* TG expanded */}
      {method === 'tg' && (
        <div className="mb-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,215,49,0.18)' }}>
          {tgPhase === 'idle' ? (
            <div className="flex items-center gap-3 flex-wrap">
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Подпишись и подтверди через бота
              </p>
              <button onClick={startTG} disabled={tgLoading}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 999, background: '#2AABEE', color: '#fff', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', opacity: tgLoading ? 0.5 : 1 }}>
                {tgLoading ? '…' : 'Начать →'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <a href={TG_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: 999, background: '#2AABEE', color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                1. Подписаться на канал →
              </a>
              <a href={tgBotUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: 999, background: '#FFD731', color: '#111', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                2. Подтвердить в боте →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Promo — no divider label, seamless part of block */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{ border: '2px solid rgba(255,255,255,0.13)', background: 'rgba(255,255,255,0.05)' }}>
          <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} strokeWidth={2.5} />
          <input
            ref={promoRef}
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && redeemPromo()}
            placeholder="Промокод"
            className="bg-transparent text-white placeholder-white/20 font-extrabold text-sm w-full outline-none tracking-widest"
          />
        </div>
        <button
          onClick={redeemPromo}
          disabled={promoState === 'loading' || !promoCode.trim()}
          style={{
            background: promoState === 'ok' ? '#55DB9C' : '#FFD731',
            color: '#111', border: 'none', borderRadius: 999,
            padding: '8px 18px', fontSize: 13, fontWeight: 800,
            cursor: 'pointer', flexShrink: 0,
            opacity: (!promoCode.trim() || promoState === 'loading') ? 0.4 : 1,
          }}
        >
          {promoState === 'loading' ? '…' : promoState === 'ok' ? '✓' : 'Применить'}
        </button>
      </div>
      {(promoState === 'ok' || promoState === 'error') && promoMsg && (
        <p style={{ fontSize: 12, fontWeight: 700, marginTop: 6, color: promoState === 'ok' ? '#55DB9C' : '#f87171' }}>
          {promoMsg}
        </p>
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
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-white/15 bg-white/5">
          <Tag className="w-4 h-4 text-white/30 shrink-0" strokeWidth={2.5} />
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && redeem()}
            placeholder="Промокод"
            className="bg-transparent text-white placeholder-white/25 font-extrabold text-sm w-full outline-none tracking-widest"
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
