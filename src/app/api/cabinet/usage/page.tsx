import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { usd, type ApiUsage } from '../types'

export const metadata: Metadata = { title: 'Usage' }

export default async function UsagePage() {
  const u = await api.get<ApiUsage>('/v1/me/api/usage?days=30').catch(() => null)
  const activeDays = u ? u.daily.filter((d) => d.orders > 0).reverse() : []

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="display text-4xl">Usage</h1>
        <p className="font-semibold text-ink/60 mt-2">
          {u ? 'Orders and spend for the last 30 days.' : 'Could not load usage. Reload the page in a moment.'}
        </p>
      </div>

      {u && !u.enabled && (
        <div className="panel">
          <p className="font-semibold">
            Nothing to show yet. <Link href="/api/cabinet" className="underline underline-offset-2">Create your partner account</Link> and place the first order.
          </p>
        </div>
      )}

      {u && u.enabled && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="panel">
              <span className="chip" style={{ background: 'var(--yellow)' }}>Spent</span>
              <div className="display text-4xl mt-4 tabular-nums">{usd(u.totals.spent_usd)}</div>
              <div className="font-semibold text-ink/60 text-sm mt-2">{u.totals.orders} orders</div>
            </div>
            <div className="panel">
              <span className="chip" style={{ background: 'var(--green)' }}>eSIM</span>
              <div className="display text-4xl mt-4 tabular-nums">{u.totals.esim}</div>
              <div className="font-semibold text-ink/60 text-sm mt-2">orders</div>
            </div>
            <div className="panel">
              <span className="chip" style={{ background: 'var(--paper)' }}>VPN</span>
              <div className="display text-4xl mt-4 tabular-nums">{u.totals.vpn}</div>
              <div className="font-semibold text-ink/60 text-sm mt-2">orders</div>
            </div>
          </div>

          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="px-5 py-4 border-b-2 border-ink"><h2 className="display text-2xl">By day</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-ink/60 border-b-2 border-ink">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">eSIM</th>
                    <th className="px-5 py-3 text-right">VPN</th>
                    <th className="px-5 py-3 text-right">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDays.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center font-semibold text-ink/60">No orders in the last 30 days.</td></tr>
                  ) : activeDays.map((d) => (
                    <tr key={d.date} className="border-t border-ink/15 first:border-t-0">
                      <td className="px-5 py-3 font-semibold text-ink/60 whitespace-nowrap">{new Date(d.date).toLocaleDateString('en', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-5 py-3 text-right font-bold tabular-nums">{d.esim}</td>
                      <td className="px-5 py-3 text-right font-bold tabular-nums">{d.vpn}</td>
                      <td className="px-5 py-3 text-right font-extrabold tabular-nums">{usd(d.spent_usd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {u.esim_countries.length > 0 && (
            <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-5 py-4 border-b-2 border-ink"><h2 className="display text-2xl">eSIM by country</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {u.esim_countries.map((c) => (
                      <tr key={c.country} className="border-t border-ink/15 first:border-t-0">
                        <td className="px-5 py-3 font-bold">{c.country}</td>
                        <td className="px-5 py-3 text-right font-semibold text-ink/60 tabular-nums">{c.orders} orders</td>
                        <td className="px-5 py-3 text-right font-extrabold tabular-nums">{usd(c.spent_usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="panel">
            <span className="chip" style={{ background: 'var(--paper)' }}>Limits</span>
            <p className="font-semibold mt-3">
              {u.limits.requests_per_minute} requests per minute.{' '}
              {u.limits.daily_spend_usd
                ? `Daily spend ${usd(u.limits.spent_today_usd)} of ${usd(u.limits.daily_spend_usd)}.`
                : `Spent today ${usd(u.limits.spent_today_usd)}, no daily limit.`}
            </p>
          </section>
        </>
      )}
    </div>
  )
}
