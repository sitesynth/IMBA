import type { Metadata } from 'next'
import { api } from '@/lib/api'
import { describeOrder, usd, type ApiOrder } from '../types'

export const metadata: Metadata = { title: 'Orders' }

export default async function OrdersPage() {
  const data = await api.get<{ orders: ApiOrder[] }>('/v1/me/api/orders').catch(() => null)
  const orders = data?.orders ?? []
  const total = orders.reduce((a, o) => a + o.charged_usd, 0)

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="display text-4xl">Orders</h1>
        <p className="font-semibold text-ink/60 mt-2">
          {data ? `${orders.length} orders, ${usd(total)} in total (latest 200).` : 'Could not load orders. Reload the page in a moment.'}
        </p>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-ink/60 border-b-2 border-ink">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3 text-right">Charged</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center font-semibold text-ink/60">No orders yet. Place the first one through the API.</td></tr>
              ) : orders.map((o) => (
                <tr key={o.order_id} className="border-t border-ink/15 first:border-t-0">
                  <td className="px-5 py-3 font-semibold text-ink/60 whitespace-nowrap">{new Date(o.created_at).toLocaleString('en', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-5 py-3 font-bold">{describeOrder(o)}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{o.order_id.slice(0, 8)}</td>
                  <td className="px-5 py-3 text-right font-extrabold tabular-nums">{usd(o.charged_usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
