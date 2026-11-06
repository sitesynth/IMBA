'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Copy, KeyRound } from 'lucide-react'

interface ApiOrder {
  order_id: string
  kind: 'esim' | 'vpn'
  created_at: string
  charged_usd: number
  country?: string
  data_gb?: number
  months?: number
}

export type ApiState =
  | { enabled: false; balance_usd: number }
  | {
      enabled: true
      status: 'active' | 'suspended'
      key_prefix: string
      balance_usd: number
      limits: { requests_per_minute: number; daily_spend_usd: number | null; spent_today_usd: number }
      orders: ApiOrder[]
    }

const usd = (n: number) => `$${n.toFixed(2)}`
const card = 'bg-white rounded-xl border border-gray-200 p-5'

function describe(o: ApiOrder) {
  if (o.kind === 'vpn') return `VPN, ${o.months} ${o.months === 1 ? 'month' : 'months'}`
  return `eSIM ${o.country ?? ''} ${o.data_gb ?? ''} GB`.trim()
}

export function ApiCabinet({ initial, email }: { initial: ApiState | null; email: string }) {
  const [state, setState] = useState<ApiState | null>(initial)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function call(path: string) {
    setBusy(true); setError('')
    try {
      const res = await fetch(`/api/v1/me/api${path}`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.detail || `Request failed (${res.status})`)
      const { api_key, ...rest } = body as { api_key: string } & ApiState
      setState(rest as ApiState)
      setNewKey(api_key)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function replaceKey() {
    if (!confirm('Replace the key? The current key stops working immediately.')) return
    await call('/rotate-key')
  }

  async function copyKey() {
    if (!newKey) return
    try { await navigator.clipboard.writeText(newKey); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <div className="admin-root space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner API</h1>
          <p className="text-sm text-gray-600 mt-1">
            Sell IMBA eSIM and VPN to your own customers. Signed in as <span className="font-semibold">{email}</span>.
          </p>
        </div>
        <Link href="/api" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold bg-white hover:bg-gray-50">
          API documentation
        </Link>
      </div>

      {error && <div className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

      {newKey && (
        <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-5 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Your API key</h2>
          <p className="text-sm text-gray-700">
            This is the only time the key is shown. Copy it into your server configuration now; if you lose it, replace it with a new one.
          </p>
          <div className="flex items-stretch gap-2">
            <code className="flex-1 min-w-0 break-all bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono select-all">{newKey}</code>
            <button onClick={copyKey} className="px-3 border border-gray-300 bg-white rounded-lg hover:bg-gray-50" aria-label="Copy key">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            I saved the key
          </button>
        </div>
      )}

      {!state && (
        <div className={card}>
          <p className="text-sm text-gray-700">Could not load your API status. Reload the page in a moment.</p>
        </div>
      )}

      {state && !state.enabled && (
        <div className={`${card} space-y-4`}>
          <div className="flex items-center gap-3">
            <KeyRound className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Get access to the API</h2>
          </div>
          <p className="text-sm text-gray-700 max-w-2xl">
            You get a key for the eSIM and VPN catalogs and for ordering. Orders are paid from your IMBA balance
            (currently <span className="font-semibold">{usd(state.balance_usd)}</span>), which you top up with crypto or any other method on the billing page.
            New keys start at 30 requests per minute and a $50 daily spend limit; write to us to raise them.
          </p>
          <button onClick={() => call('/enable')} disabled={busy} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
            {busy ? 'Creating…' : 'Get my API key'}
          </button>
        </div>
      )}

      {state && state.enabled && (
        <>
          {state.status === 'suspended' && (
            <div className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
              API access is suspended for your account. Requests are refused until it is switched back on; contact us.
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div className={card}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Balance</div>
              <div className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">{usd(state.balance_usd)}</div>
              <Link href="/dashboard/billing" className="inline-block mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100">
                Top up
              </Link>
            </div>
            <div className={card}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Spent today</div>
              <div className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">{usd(state.limits.spent_today_usd)}</div>
              <div className="text-sm text-gray-600 mt-1">
                {state.limits.daily_spend_usd ? `of ${usd(state.limits.daily_spend_usd)} daily limit` : 'no daily limit'}
              </div>
            </div>
            <div className={card}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate limit</div>
              <div className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">{state.limits.requests_per_minute}</div>
              <div className="text-sm text-gray-600 mt-1">requests per minute</div>
            </div>
          </div>

          <div className={`${card} space-y-3`}>
            <h2 className="text-lg font-bold text-gray-900">API key</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono">{state.key_prefix}…</code>
              <button onClick={replaceKey} disabled={busy} className="px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Replace key
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-xl px-4 py-3.5 text-[13px] leading-relaxed overflow-x-auto font-mono"><code>{`curl https://api.imba.live/v1/partner/me \\
  -H "Authorization: Bearer ${state.key_prefix}…"`}</code></pre>
          </div>

          <div className={`${card} p-0 overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-lg font-bold text-gray-900">Recent orders</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3 text-right">Charged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.orders.length === 0 ? (
                    <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-500">No orders yet. Place the first one through the API.</td></tr>
                  ) : state.orders.map((o) => (
                    <tr key={o.order_id}>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{new Date(o.created_at).toLocaleString('en', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-5 py-3 text-gray-900">{describe(o)}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{usd(o.charged_usd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
