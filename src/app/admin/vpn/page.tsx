'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getVpnSubs, recreateVpn, revokeVpnAdmin, AdminVpnSub } from '@/lib/admin-api'

function ProviderBadge({ provider }: { provider: string }) {
  if (provider === 'remnawave') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Remnawave</span>
  )
  if (provider === 'mock') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">WireGuard mock</span>
  )
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Unknown</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

export default function AdminVpnPage() {
  const [subs, setSubs] = useState<AdminVpnSub[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterProvider, setFilterProvider] = useState('')
  const [busy, setBusy] = useState<Record<string, string>>({}) // id → action

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getVpnSubs({
        status: filterStatus || undefined,
        provider: filterProvider || undefined,
        limit: 200,
      })
      setSubs(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filterStatus, filterProvider])

  async function handleRecreate(id: string) {
    if (!confirm('Пересоздать VPN-подписку? Старый ключ будет отозван.')) return
    setBusy(b => ({ ...b, [id]: 'recreate' }))
    try {
      await recreateVpn(id)
      await load()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(b => { const n = { ...b }; delete n[id]; return n })
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Отозвать VPN-подписку?')) return
    setBusy(b => ({ ...b, [id]: 'revoke' }))
    try {
      await revokeVpnAdmin(id)
      await load()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(b => { const n = { ...b }; delete n[id]; return n })
    }
  }

  const mockCount = subs.filter(s => s.provider === 'mock').length
  const remnaCount = subs.filter(s => s.provider === 'remnawave').length
  const activeCount = subs.filter(s => s.status === 'active').length

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">VPN Subscriptions</h1>
        <button onClick={load} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: subs.length, color: 'bg-white' },
          { label: 'Active', value: activeCount, color: 'bg-white' },
          { label: 'Remnawave ✓', value: remnaCount, color: 'bg-green-50' },
          { label: 'Mock/WG ⚠', value: mockCount, color: 'bg-red-50' },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-lg border border-gray-200 p-4`}>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filterProvider}
          onChange={e => setFilterProvider(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All providers</option>
          <option value="remnawave">Remnawave</option>
          <option value="mock">Mock / WireGuard</option>
          <option value="unknown">Unknown</option>
        </select>
        {mockCount > 0 && !filterProvider && (
          <button
            onClick={() => setFilterProvider('mock')}
            className="text-sm bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 transition"
          >
            Show {mockCount} WG users to fix
          </button>
        )}
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Loading...</div>}
      {error && <div className="text-center py-8 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expires</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map(s => (
                <tr key={s.id} className={`hover:bg-gray-50 ${s.provider === 'mock' ? 'bg-red-50/40' : ''}`}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${s.user_id}`} className="text-blue-600 hover:underline font-medium">
                      {s.email ?? '—'}
                    </Link>
                    {s.name && <div className="text-xs text-gray-400">{s.name}</div>}
                  </td>
                  <td className="px-4 py-3"><ProviderBadge provider={s.provider} /></td>
                  <td className="px-4 py-3 text-gray-700">{s.plan}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {s.expires_at ? new Date(s.expires_at).toLocaleDateString('ru') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRecreate(s.id)}
                        disabled={!!busy[s.id]}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        {busy[s.id] === 'recreate' ? '…' : 'Recreate'}
                      </button>
                      {s.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(s.id)}
                          disabled={!!busy[s.id]}
                          className="text-xs px-2.5 py-1.5 rounded-md bg-red-100 text-red-700 font-semibold hover:bg-red-200 disabled:opacity-50 transition"
                        >
                          {busy[s.id] === 'revoke' ? '…' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">No VPN subscriptions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
