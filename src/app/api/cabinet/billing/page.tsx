import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { usd, type ApiBilling } from '../types'

export const metadata: Metadata = { title: 'Billing' }

const KIND: Record<string, { label: string; tone: string }> = {
  topup: { label: 'Top-up', tone: 'var(--green)' },
  credit: { label: 'Credit', tone: 'var(--yellow)' },
  order: { label: 'Order', tone: 'var(--paper)' },
}

export default async function BillingPage() {
  const b = await api.get<ApiBilling>('/v1/me/api/billing').catch(() => null)

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="display text-4xl">Billing</h1>
        <p className="font-semibold text-ink/60 mt-2">
          {b ? 'Every movement of your API balance.' : 'Could not load billing. Reload the page in a moment.'}
        </p>
      </div>

      {b && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="panel">
              <span className="chip" style={{ background: 'var(--yellow)' }}>Balance</span>
              <div className="display text-4xl mt-4 tabular-nums">{usd(b.balance_usd)}</div>
              <Link href="/api/cabinet/topup" className="pill pill-ink pill-sm mt-3 inline-flex">Top up →</Link>
            </div>
            <div className="panel">
              <span className="chip" style={{ background: 'var(--green)' }}>Topped up</span>
              <div className="display text-4xl mt-4 tabular-nums">{usd(b.totals.topped_up_usd + b.totals.credited_usd)}</div>
              <div className="font-semibold text-ink/60 text-sm mt-2">all time</div>
            </div>
            <div className="panel">
              <span className="chip" style={{ background: 'var(--paper)' }}>Spent</span>
              <div className="display text-4xl mt-4 tabular-nums">{usd(b.totals.spent_usd)}</div>
              <div className="font-semibold text-ink/60 text-sm mt-2">on orders</div>
            </div>
          </div>

          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="px-5 py-4 border-b-2 border-ink"><h2 className="display text-2xl">History</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {b.entries.length === 0 ? (
                    <tr><td className="px-5 py-8 text-center font-semibold text-ink/60">Nothing yet. Top up the balance to place orders.</td></tr>
                  ) : b.entries.map((e, i) => {
                    const k = KIND[e.kind]
                    return (
                      <tr key={i} className="border-t border-ink/15 first:border-t-0">
                        <td className="px-5 py-3 font-semibold text-ink/60 whitespace-nowrap">{e.date ? new Date(e.date).toLocaleString('en', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                        <td className="px-5 py-3"><span className="chip" style={{ background: k.tone }}>{k.label}</span></td>
                        <td className="px-5 py-3 font-bold">{e.title}</td>
                        <td className="px-5 py-3 text-right font-extrabold tabular-nums">{e.amount_usd > 0 ? '+' : '−'}{usd(Math.abs(e.amount_usd))}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
