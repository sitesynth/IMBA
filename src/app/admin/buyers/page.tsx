'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getBuyers, BuyersData } from '@/lib/admin-api'

const PERIODS = [
  { days: 7, label: '7 дней' },
  { days: 30, label: '30 дней' },
  { days: 90, label: '90 дней' },
  { days: 0, label: 'Всё время' },
]

const PROVIDER_LABEL: Record<string, string> = {
  freekassa: 'FreeKassa',
  heleket: 'Heleket',
  'heleket-run': 'Heleket (imba.run)',
}

const CURRENCY_SYMBOL: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€' }

function money(cur: string, amount: number) {
  const sym = CURRENCY_SYMBOL[cur] ?? cur
  const n = amount.toLocaleString('ru', { maximumFractionDigits: 2 })
  return cur === 'RUB' ? `${n} ${sym}` : `${sym}${n}`
}

function original(o: Record<string, number>) {
  const parts = Object.entries(o).map(([cur, amt]) => money(cur, amt))
  return parts.length ? parts.join(' + ') : '—'
}

function date(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ru', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-xl font-bold text-gray-900 mt-0.5">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
    </div>
  )
}

export default function AdminBuyers() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<BuyersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [provider, setProvider] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getBuyers(days)
      .then(d => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setError((e as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [days])

  const buyers = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    return data.buyers.filter(b =>
      (!provider || b.providers.includes(provider)) &&
      (!q || (b.email ?? '').toLowerCase().includes(q) || (b.name ?? '').toLowerCase().includes(q)),
    )
  }, [data, provider, query])

  const maxDay = useMemo(() => Math.max(0, ...(data?.by_day ?? []).map(d => d.revenue_usd)), [data])
  const s = data?.stats

  return (
    <div className="max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Покупатели</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {PERIODS.map(p => (
            <button key={p.days} onClick={() => setDays(p.days)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${days === p.days ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Только те, кто оплатил через платёжку (FreeKassa, Heleket). Аккаунты, которым когда-либо начисляли баланс вручную (админом или демо-пополнением), в статистику не входят.
      </p>

      {loading && <div className="text-center py-12 text-gray-500">Загрузка…</div>}
      {error && <div className="text-center py-8 text-red-600">{error}</div>}

      {data && s && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Card label="Покупателей за период" value={String(s.buyers_period)} hint={`из них новых: ${s.new_buyers_period}`} />
            <Card
              label="Выручка за период"
              value={Object.keys(s.revenue_by_currency_period).length
                ? Object.entries(s.revenue_by_currency_period).map(([c, a]) => money(c, a)).join(' + ')
                : '0'}
              hint={`≈ $${s.revenue_usd_period.toFixed(2)} на баланс`}
            />
            <Card label="Платежей" value={String(s.payments_period)} hint={`средний чек $${s.avg_check_usd.toFixed(2)}`} />
            <Card
              label="Счета → оплата"
              value={`${s.conversion_pct}%`}
              hint={`оплачено ${s.invoices_paid_period} из ${s.invoices_created_period} созданных`}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card label="Покупателей за всё время" value={String(s.buyers_all_time)} />
            <Card label="Повторных покупателей" value={String(s.repeat_buyers_all_time)} hint="2 и более платежа за всё время" />
            <Card label="Доля от пользователей" value={`${s.buyer_share_pct}%`} hint={`${s.buyers_all_time} из ${s.users_total}`} />
            <Card label="Новых за период" value={String(s.new_buyers_period)} hint="первая оплата в этом периоде" />
          </div>

          <h2 className="text-sm font-semibold text-gray-700 mb-2">По платёжным системам</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Платёжка', 'Счетов создано', 'Оплачено', 'Конверсия', 'Покупателей', 'Выручка'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.by_provider.map(p => (
                  <tr key={p.provider}>
                    <td className="px-4 py-3 font-medium text-gray-900">{PROVIDER_LABEL[p.provider] ?? p.provider}</td>
                    <td className="px-4 py-3 text-gray-700">{p.invoices_created}</td>
                    <td className="px-4 py-3 text-gray-700">{p.invoices_paid}</td>
                    <td className="px-4 py-3 text-gray-700">{p.conversion_pct}%</td>
                    <td className="px-4 py-3 text-gray-700">{p.buyers}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">${p.revenue_usd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.by_day.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Выручка по дням</h2>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 mb-6 space-y-1.5">
                {data.by_day.slice(-30).map(d => (
                  <div key={d.date} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-gray-500 tabular-nums">{d.date}</span>
                    <div className="flex-1 bg-gray-100 rounded h-3">
                      <div className="bg-blue-500 h-3 rounded" style={{ width: `${maxDay ? Math.max(2, (d.revenue_usd / maxDay) * 100) : 0}%` }} />
                    </div>
                    <span className="w-28 text-right text-gray-700 tabular-nums">${d.revenue_usd.toFixed(2)} · {d.payments} пл.</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h2 className="text-sm font-semibold text-gray-700 mr-2">Список покупателей ({buyers.length})</h2>
            <select value={provider} onChange={e => setProvider(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Все платёжки</option>
              <option value="freekassa">FreeKassa</option>
              <option value="heleket">Heleket</option>
              <option value="heleket-run">Heleket (imba.run)</option>
            </select>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по email или имени"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Покупатель', 'Платёжка', 'Платежей', 'Сумма', 'Первая оплата', 'Последняя оплата', 'Баланс'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buyers.map(b => (
                  <tr key={b.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${b.user_id}`} className="text-blue-600 hover:underline font-medium">
                        {b.email ?? '—'}
                      </Link>
                      {b.is_new && <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">новый</span>}
                      {b.name && <div className="text-xs text-gray-400">{b.name}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.providers.map(p => PROVIDER_LABEL[p] ?? p).join(', ')}</td>
                    <td className="px-4 py-3 text-gray-700 tabular-nums">{b.payments}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 font-medium whitespace-nowrap">{original(b.original)}</div>
                      <div className="text-xs text-gray-400">${b.total_usd.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{date(b.first_paid_at)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{date(b.last_paid_at)}</td>
                    <td className="px-4 py-3 text-gray-700 tabular-nums">${b.balance_usd.toFixed(2)}</td>
                  </tr>
                ))}
                {buyers.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Покупателей за этот период нет</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
