'use client'
import { useEffect, useState } from 'react'
import { getStats, Stats } from '@/lib/admin-api'

const PERIODS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
]

export default function AdminStats() {
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getStats(days)
      .then(setStats)
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [days])

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {PERIODS.map(p => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                days === p.days
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Loading...</div>}
      {error && <div className="text-center text-red-600 py-8">{error}</div>}

      {!loading && !error && stats && (
        <>
          {/* Main counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Users', value: stats.users_total },
              { label: `New (${days}d)`, value: stats.users_new_30d },
              { label: `Revenue (${days}d)`, value: '$' + stats.revenue_30d?.toFixed(2) },
              { label: 'Active eSIMs', value: stats.active_esims },
              { label: 'Active VPNs', value: stats.active_vpns },
              { label: 'Active Cards', value: stats.active_cards },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Revenue breakdown */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Revenue ({days}d)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">RUB total</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.revenue_rub?.total ?? 0).toLocaleString('ru')} ₽</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Avg RUB check</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.revenue_rub?.avg_check ?? 0).toLocaleString('ru')} ₽</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">USD total</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.revenue_usd?.total ?? 0).toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Avg USD check</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.revenue_usd?.avg_check ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Conversion */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Conversions ({days}d)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Avg registrations/day</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.registrations_by_day?.length
                    ? (stats.registrations_by_day.reduce((s, r) => s + r.count, 0) / stats.registrations_by_day.length).toFixed(1)
                    : '0'}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Same-day conversions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.same_day_conversions ?? 0}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Conversion %</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversion_pct ?? 0}%</p>
              </div>
            </div>
          </div>

          {/* Revenue by day chart */}
          {stats.revenue_by_day?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Revenue by day</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-end gap-1 h-32">
                  {(() => {
                    const max = Math.max(...stats.revenue_by_day.map(r => r.amount), 1)
                    return stats.revenue_by_day.map(r => (
                      <div key={r.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                        <div
                          className="w-full bg-blue-500 rounded-sm"
                          style={{ height: `${Math.max(2, (r.amount / max) * 100)}%` }}
                          title={`${r.date}: $${r.amount.toFixed(2)}`}
                        />
                      </div>
                    ))
                  })()}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{stats.revenue_by_day[0]?.date}</span>
                  <span>{stats.revenue_by_day[stats.revenue_by_day.length - 1]?.date}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
