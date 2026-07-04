'use client'
import { useEffect, useState } from 'react'
import { getTransactions, Transaction } from '@/lib/admin-api'

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function AdminTransactions() {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // filters
  const [status, setStatus] = useState('')
  const [currency, setCurrency] = useState('')
  const [provider, setProvider] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getTransactions({ limit: 200, status: status || undefined, currency: currency || undefined, provider: provider || undefined })
      setTxs(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // stats bar
  const totalRub = txs.filter(t => t.currency === 'RUB' && (t.status === 'confirmed' || t.status === 'completed')).reduce((s, t) => s + t.amount, 0)
  const totalUsd = txs.filter(t => t.currency === 'USD' && (t.status === 'confirmed' || t.status === 'completed')).reduce((s, t) => s + t.amount, 0)
  const countConfirmed = txs.filter(t => t.status === 'confirmed' || t.status === 'completed').length

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transactions</h1>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-500 font-medium">Total RUB (shown)</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">{totalRub.toLocaleString('ru')} ₽</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-500 font-medium">Total USD (shown)</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">${totalUsd.toFixed(2)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-500 font-medium">Confirmed</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">{countConfirmed}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-500 font-medium">Avg RUB check</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">
            {countConfirmed > 0 ? Math.round(totalRub / countConfirmed).toLocaleString('ru') : 0} ₽
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All statuses</option>
          <option value="confirmed">confirmed</option>
          <option value="pending">pending</option>
          <option value="failed">failed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <select value={currency} onChange={e => setCurrency(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All currencies</option>
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
        </select>
        <select value={provider} onChange={e => setProvider(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All providers</option>
          <option value="enot">Enot</option>
          <option value="yookassa">YooKassa</option>
          <option value="cryptobot">CryptoBot</option>
          <option value="stars">Telegram Stars</option>
        </select>
        <button onClick={load} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          Apply
        </button>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Payment ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Currency</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Note</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : txs.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No transactions</td></tr>
            ) : txs.map((t) => (
              <tr key={t.payment_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-600 text-xs">{t.payment_id.slice(0, 18)}…</td>
                <td className="px-4 py-3 text-gray-700">{t.email || '—'}</td>
                <td className="px-4 py-3 font-mono font-semibold text-gray-900">{t.amount?.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">{t.currency}</td>
                <td className="px-4 py-3 text-gray-600">{t.provider || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[t.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{t.note || '—'}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(t.created_at).toLocaleDateString('ru')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
