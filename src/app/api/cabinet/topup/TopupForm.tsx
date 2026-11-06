'use client'
import { useState } from 'react'
import { LottieSticker } from '@/components/LottieSticker'
import { usd, type ApiTopup } from '../types'

const PRESETS = [10, 25, 50, 100, 250, 500]
const STATUS: Record<string, { label: string; tone: string }> = {
  confirmed: { label: 'Paid', tone: 'var(--green)' },
  pending: { label: 'Waiting for payment', tone: 'var(--yellow)' },
  expired: { label: 'Expired', tone: 'var(--paper)' },
}

export function TopupForm({ balance, topups }: { balance: number; topups: ApiTopup[] }) {
  const [amount, setAmount] = useState('50')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/v1/me/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_usd: value }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.detail || `Request failed (${res.status})`)
      window.location.href = body.payment_url
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6 fade-up">
      <section className="panel flex items-center gap-5 flex-wrap">
        <LottieSticker name="coin" size={96} />
        <div className="flex-1 min-w-[220px]">
          <h1 className="display text-4xl">Top up</h1>
          <p className="font-semibold text-ink/60 mt-2">
            Pay in crypto, the balance is credited automatically once the network confirms it (usually within minutes).
          </p>
        </div>
        <div className="text-right">
          <span className="chip" style={{ background: 'var(--yellow)' }}>Balance</span>
          <div className="display text-4xl mt-2 tabular-nums">{usd(balance)}</div>
        </div>
      </section>

      <section className="panel space-y-4">
        <h2 className="display text-2xl">Amount, USD</h2>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p} type="button" onClick={() => setAmount(String(p))}
              className="pill pill-sm" style={parseFloat(amount) === p ? { background: 'var(--ink)', color: 'var(--paper)' } : { background: 'var(--paper)', border: '2px solid var(--ink)' }}
            >
              ${p}
            </button>
          ))}
        </div>
        <form onSubmit={pay} className="flex items-stretch gap-3 flex-wrap">
          <input
            type="number" min={5} max={5000} step="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="px-4 py-3 border-2 border-ink rounded-2xl font-bold text-lg bg-cream focus:bg-paper transition-colors w-40" aria-label="Amount in USD"
          />
          <button type="submit" disabled={busy || !parseFloat(amount)} className="pill pill-ink disabled:opacity-60">
            {busy ? 'Creating invoice…' : 'Pay with crypto →'}
          </button>
        </form>
        <p className="text-sm font-semibold text-ink/60">From $5 to $5,000 per payment. You are taken to the payment page and come back here.</p>
        {error && (
          <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>{error}</div>
        )}
      </section>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="px-5 py-4 border-b-2 border-ink"><h2 className="display text-2xl">Payments</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {topups.length === 0 ? (
                <tr><td className="px-5 py-8 text-center font-semibold text-ink/60">No payments yet.</td></tr>
              ) : topups.map((t) => {
                const s = STATUS[t.status] ?? { label: t.status, tone: 'var(--paper)' }
                return (
                  <tr key={t.payment_id} className="border-t border-ink/15 first:border-t-0">
                    <td className="px-5 py-3 font-semibold text-ink/60 whitespace-nowrap">{t.created_at ? new Date(t.created_at).toLocaleString('en', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                    <td className="px-5 py-3"><span className="chip" style={{ background: s.tone }}>{s.label}</span></td>
                    <td className="px-5 py-3 text-right font-extrabold tabular-nums">{usd(t.amount_usd)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
