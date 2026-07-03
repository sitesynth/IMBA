'use client'
import { useEffect, useState } from 'react'
import { getStats, Stats } from '@/lib/admin-api'

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getStats()
        setStats(data)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!stats) return <div className="p-8 text-center">No data</div>

  const regsPerDay = stats.registrations_by_day ?? []
  const avgRegsPerDay = regsPerDay.length > 0
    ? (regsPerDay.reduce((s, r) => s + r.count, 0) / regsPerDay.length).toFixed(1)
    : '0'

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>

      {/* Main counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: stats.users_total },
          { label: 'New (30d)', value: stats.users_new_30d },
          { label: 'Revenue (30d)', value: '$' + stats.revenue_30d?.toFixed(2) },
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
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Revenue (30d)</h2>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Conversions (30d)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-4">
            <p className="text-xs text-gray-500 font-medium mb-1">Avg registrations/day</p>
            <p className="text-2xl font-bold text-gray-900">{avgRegsPerDay}</p>
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

      {/* Revenue by day chart (simple bar) */}
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
                      title={`${r.date}: ${r.amount.toFixed(2)}`}
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
    </div>
  )
}
