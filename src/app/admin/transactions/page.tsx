'use client'
import { useEffect, useState } from 'react'
import { getTransactions, Transaction } from '@/lib/admin-api'

export default function AdminTransactions() {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getTransactions({ limit: 100 })
        setTxs(data)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Transactions</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Note</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {txs.map((t) => (
              <tr key={t.payment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-700">{t.payment_id.slice(0, 20)}...</td>
                <td className="px-6 py-4 text-sm text-gray-700">{t.email || '—'}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-900">${t.amount?.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{t.currency}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    t.status === 'completed' ? 'bg-green-100 text-green-800' :
                    t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{t.note || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
