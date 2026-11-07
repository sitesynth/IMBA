'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { LottieSticker } from '@/components/LottieSticker'
import { describeOrder, usd, type ApiState } from './types'

function Stat({ label, value, note, tone }: { label: string; value: string; note?: string; tone: string }) {
  return (
    <div className="panel">
      <span className="chip" style={{ background: tone }}>{label}</span>
      <div className="display text-4xl mt-4 tabular-nums">{value}</div>
      {note && <div className="font-semibold text-ink/60 text-sm mt-2">{note}</div>}
    </div>
  )
}

export function Overview({ initial, email }: { initial: ApiState | null; email: string }) {
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
    <div className="space-y-6 fade-up">
      {/* Hero in the landing page's blue, with its floating stickers */}
      <section
        className="relative overflow-hidden rounded-3xl border-2 border-ink px-6 py-8 md:px-10 md:py-10"
        style={{ background: 'var(--blue)', color: 'var(--paper)', boxShadow: '6px 6px 0 0 var(--ink)' }}
      >
        <LottieSticker name="plug" size={165} className="sticker hidden md:block" style={{ top: '34%', right: '5%', ['--rot' as string]: '-4deg' }} />
        <LottieSticker name="plug" size={120} className="sticker sm:hidden" style={{ top: '6%', right: '3%', ['--rot' as string]: '-4deg' }} />
        <LottieSticker name="keys" size={88} className="sticker hidden sm:block" style={{ top: '6%', right: '6%', ['--rot' as string]: '-12deg', animationDelay: '0.4s' }} />
        <LottieSticker name="coin" size={74} className="sticker hidden md:block" style={{ bottom: '8%', right: '3%', ['--rot' as string]: '10deg', animationDelay: '0.8s' }} />
        <span className="chip" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>eSIM · VPN · API</span>
        <h1 className="display text-4xl md:text-6xl mt-4 mb-3">IMBA API<br />cabinet</h1>
        <p className="font-semibold max-w-sm md:max-w-[22rem]" style={{ opacity: 0.9 }}>
          Sell IMBA eSIM and VPN to your own customers. Signed in as <span className="font-extrabold">{email}</span>.
        </p>
        <Link href="/api/cabinet/docs" className="pill pill-yellow pill-sm mt-5 inline-flex">API documentation →</Link>
      </section>

      {error && (
        <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>{error}</div>
      )}

      {newKey && (
        <section className="panel space-y-3" style={{ background: 'var(--yellow)' }}>
          <h2 className="display text-2xl">Your API key</h2>
          <p className="font-semibold text-sm">
            This is the only time the key is shown. Copy it into your server configuration now; if you lose it, replace it with a new one.
          </p>
          <div className="flex items-stretch gap-2">
            <code className="flex-1 min-w-0 break-all bg-paper border-2 border-ink rounded-2xl px-4 py-3 text-xs font-mono select-all">{newKey}</code>
            <button onClick={copyKey} className="pill pill-paper pill-sm" aria-label="Copy key">
              {copied ? <Check className="w-4 h-4" strokeWidth={3} /> : <Copy className="w-4 h-4" strokeWidth={3} />}
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="pill pill-ink pill-sm">I saved the key</button>
        </section>
      )}

      {!state && (
        <div className="panel"><p className="font-semibold">Could not load your API status. Reload the page in a moment.</p></div>
      )}

      {state && !state.enabled && (
        <section className="panel space-y-4">
          <span className="chip" style={{ background: 'var(--green)' }}>Step 1</span>
          <h2 className="display text-3xl">Become a partner</h2>
          <p className="font-semibold text-ink/70 max-w-2xl">
            This creates your partner account: its own key and its own balance, starting at $0 and separate from your IMBA balance.
            Orders are paid from it, and you top it up with crypto on the <Link href="/api/cabinet/topup" className="underline underline-offset-2 text-ink">Top up</Link> page.
            New keys start at 30 requests per minute and a $50 daily spend limit; write to us to raise them.
          </p>
          <button onClick={() => call('/enable')} disabled={busy} className="pill pill-ink disabled:opacity-60">
            {busy ? 'Creating…' : 'Get my API key →'}
          </button>
        </section>
      )}

      {state && state.enabled && (
        <>
          {state.status === 'suspended' && (
            <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
              API access is suspended for your account. Requests are refused until it is switched back on; contact us.
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="panel">
              <span className="chip" style={{ background: 'var(--yellow)' }}>Balance</span>
              <div className="display text-4xl mt-4 tabular-nums">{usd(state.balance_usd)}</div>
              <Link href="/api/cabinet/topup" className="pill pill-ink pill-sm mt-3 inline-flex">Top up →</Link>
            </div>
            <Stat
              label="Spent today" tone="var(--green)" value={usd(state.limits.spent_today_usd)}
              note={state.limits.daily_spend_usd ? `of ${usd(state.limits.daily_spend_usd)} daily limit` : 'no daily limit'}
            />
            <Stat label="Rate limit" tone="var(--paper)" value={String(state.limits.requests_per_minute)} note="requests per minute" />
          </div>

          <section className="panel space-y-3">
            <h2 className="display text-2xl">API key</h2>
            {state.key_issued ? (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <code className="bg-cream border-2 border-ink rounded-2xl px-4 py-2.5 text-sm font-mono">{state.key_prefix}…</code>
                  <button onClick={replaceKey} disabled={busy} className="pill pill-paper pill-sm disabled:opacity-60">Replace key</button>
                </div>
                <pre className="rounded-2xl border-2 border-ink px-4 py-3.5 text-[13px] leading-relaxed overflow-x-auto font-mono" style={{ background: 'var(--ink)', color: 'var(--paper)' }}><code>{`curl https://api.imba.live/v1/partner/me \\
  -H "Authorization: Bearer ${state.key_prefix}…"`}</code></pre>
              </>
            ) : (
              <>
                <p className="font-semibold text-ink/70 max-w-2xl">
                  Your partner account is ready with its own balance of $0, separate from your IMBA balance. Create a key to start calling the API.
                  New keys start at 30 requests per minute and a $50 daily spend limit; write to us to raise them.
                </p>
                <button onClick={() => call('/enable')} disabled={busy} className="pill pill-ink disabled:opacity-60">
                  {busy ? 'Creating…' : 'Get my API key →'}
                </button>
              </>
            )}
          </section>

          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="px-5 py-4 border-b-2 border-ink flex items-center justify-between gap-3">
              <h2 className="display text-2xl">Latest orders</h2>
              <Link href="/api/cabinet/orders" className="text-sm font-extrabold underline underline-offset-2">All orders →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {state.orders.length === 0 ? (
                    <tr><td className="px-5 py-8 text-center font-semibold text-ink/60">No orders yet. Place the first one through the API.</td></tr>
                  ) : state.orders.slice(0, 5).map((o) => (
                    <tr key={o.order_id} className="border-t border-ink/15 first:border-t-0">
                      <td className="px-5 py-3 font-semibold text-ink/60 whitespace-nowrap">{new Date(o.created_at).toLocaleString('en', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-5 py-3 font-bold">{describeOrder(o)}</td>
                      <td className="px-5 py-3 text-right font-extrabold tabular-nums">{usd(o.charged_usd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
