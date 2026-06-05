'use client'
import { useEffect, useState } from 'react'
import { getPlans, Plan } from '@/lib/admin-api'

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getPlans()
        setPlans(data)
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

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Plans</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">eSIM Slots</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">VPN</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Card Slots</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Period</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Active</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((p) => (
              <tr key={p.plan_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-900">${p.price_usd?.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{p.esim_slots}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{p.vpn_included ? '✓' : '✗'}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{p.card_slots}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.period_days}d</td>
                <td className="px-6 py-4 text-sm text-center">
                  {p.is_active ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.sort_order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
