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

  const items = [
    { label: 'Total Users', value: stats.users_total },
    { label: 'New Users (30d)', value: stats.users_new_30d },
    { label: 'Revenue (30d)', value: '$' + stats.revenue_30d?.toFixed(2) },
    { label: 'Active eSIMs', value: stats.active_esims },
    { label: 'Active VPNs', value: stats.active_vpns },
    { label: 'Active Cards', value: stats.active_cards },
  ]

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Statistics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.label} className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
            <p className="text-3xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
