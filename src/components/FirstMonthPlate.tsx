'use client'
import { useState } from 'react'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

const DEFAULT_SERVER_ID = 'c973f18c-36df-4926-b369-05ebc0604579'

// First-month offer shown on the VPN page for users who haven't claimed it yet.
export function FirstMonthPlate() {
  const locale = useLocale()
  const [claiming, setClaiming] = useState(false)
  const [needsTopup, setNeedsTopup] = useState(false)
  const [error, setError] = useState('')

  async function claim() {
    if (claiming) return
    setClaiming(true)
    setError('')
    setNeedsTopup(false)
    try {
      const res = await fetch('/api/v1/me/vpn/first-month', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ server_id: DEFAULT_SERVER_ID }),
      })
      if (res.status === 402) { setNeedsTopup(true); return }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.detail || (locale === 'ru' ? 'Не удалось активировать' : 'Activation failed'))
        return
      }
      window.location.reload()
    } catch {
      setError(locale === 'ru' ? 'Ошибка сети' : 'Network error')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="panel" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div style={{ color: '#FFD731', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        {t('trial.heading', locale)}
      </div>
      <p style={{ opacity: 0.6, fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.45 }}>{t('trial.desc', locale)}</p>
      <p style={{ opacity: 0.4, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{t('trial.then', locale)}</p>
      <button
        onClick={claim}
        disabled={claiming}
        className="w-full"
        style={{
          padding: '14px 16px', borderRadius: 16, border: 'none',
          background: '#FFD731', color: '#111', fontWeight: 800, fontSize: 14,
          cursor: claiming ? 'default' : 'pointer', opacity: claiming ? 0.6 : 1,
        }}
      >
        {claiming ? (locale === 'ru' ? 'Активируем…' : 'Activating…') : t('trial.claim_btn', locale)}
      </button>
      {needsTopup && (
        <p style={{ fontSize: 12, fontWeight: 700, color: '#FFD731', marginTop: 10 }}>
          {t('trial.topup_hint', locale)}{' '}
          <a href="/dashboard/billing/topup?amount_usd=0.56" style={{ color: '#FFD731', textDecoration: 'underline' }}>
            {locale === 'ru' ? 'Пополнить' : 'Top up'}
          </a>
        </p>
      )}
      {error && <p style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginTop: 10 }}>{error}</p>}
    </div>
  )
}
