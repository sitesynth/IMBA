'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import { getVpnSubs, recreateVpn, revokeVpnAdmin, adminReq, AdminVpnSub } from '@/lib/admin-api'
import { ApiVpnPrices } from '@/components/admin/ApiVpnPrices'

function TrafficSettings() {
  const [limitGb, setLimitGb] = useState('300')
  const [speedMbit, setSpeedMbit] = useState('10')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminReq<{ vpn_traffic_limit_gb?: string; vpn_throttle_speed_mbit?: string }>('/v1/admin/settings')
      .then(d => {
        if (d.vpn_traffic_limit_gb) setLimitGb(d.vpn_traffic_limit_gb)
        if (d.vpn_throttle_speed_mbit) setSpeedMbit(d.vpn_throttle_speed_mbit)
      }).catch(() => {})
  }, [])

  async function save() {
    setSaving(true)
    try {
      await adminReq('/v1/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({ vpn_traffic_limit_gb: limitGb, vpn_throttle_speed_mbit: speedMbit }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">Лимит трафика и шейпинг</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Лимит трафика (GB)</label>
          <input type="number" min="1" value={limitGb} onChange={e => setLimitGb(e.target.value)}
            className="w-28 text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Скорость после лимита (Мбит)</label>
          <input type="number" min="1" value={speedMbit} onChange={e => setSpeedMbit(e.target.value)}
            className="w-28 text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <button onClick={save} disabled={saving}
          className="text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 transition">
          {saving ? 'Сохраняю…' : saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
        <p className="text-xs text-gray-400 self-center">Применяется cron-задачей каждый час</p>
      </div>
    </div>
  )
}

function ProviderBadge({ provider }: { provider: string }) {
  if (provider === 'remnawave') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"><span className="w-1.5 h-1.5 rounded-full bg-green-600" />Remnawave</span>
  )
  if (provider === 'mock') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"><span className="w-1.5 h-1.5 rounded-full bg-red-600" />WireGuard mock</span>
  )
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Unknown</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active: ['bg-green-100 text-green-800', 'bg-green-600'],
    expired: ['bg-yellow-100 text-yellow-800', 'bg-yellow-600'],
    cancelled: ['bg-red-100 text-red-800', 'bg-red-600'],
  }
  const [chip, dot] = map[status] ?? ['bg-gray-100 text-gray-600', 'bg-gray-400']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${chip}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
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

  const remnaCount = subs.filter(s => s.provider === 'remnawave').length
  const activeCount = subs.filter(s => s.status === 'active').length

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">VPN Subscriptions</h1>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
          Refresh
        </button>
      </div>

      <TrafficSettings />
      <ApiVpnPrices />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: subs.length, color: 'bg-white', num: 'text-gray-900' },
          { label: 'Active', value: activeCount, color: 'bg-white', num: 'text-green-700' },
          { label: 'Remnawave ✓', value: remnaCount, color: 'bg-green-50', num: 'text-green-800' },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-xl border border-gray-200 shadow-sm p-5`}>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-600">{c.label}</div>
            <div className={`text-4xl font-extrabold tabular-nums mt-2 ${c.num}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm select-arrow"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filterProvider}
          onChange={e => setFilterProvider(e.target.value)}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm select-arrow"
        >
          <option value="">All providers</option>
          <option value="remnawave">Remnawave</option>
        </select>
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Loading...</div>}
      {error && <div className="text-center py-8 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">User</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Provider</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Plan</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Expires</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subs.map(s => (
                  <tr key={s.id} className={`hover:bg-blue-50/40 transition-colors ${s.provider === 'mock' ? 'bg-red-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${s.user_id}`} className="text-blue-700 hover:underline font-semibold">
                        {s.email ?? '—'}
                      </Link>
                      {s.name && <div className="text-xs text-gray-400">{s.name}</div>}
                    </td>
                    <td className="px-4 py-3"><ProviderBadge provider={s.provider} /></td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{s.plan}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-gray-600 text-sm tabular-nums whitespace-nowrap">
                      {s.expires_at ? new Date(s.expires_at).toLocaleDateString('ru') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRecreate(s.id)}
                          disabled={!!busy[s.id]}
                          className="text-sm px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 disabled:opacity-50 transition"
                        >
                          {busy[s.id] === 'recreate' ? '…' : 'Recreate'}
                        </button>
                        {s.status === 'active' && (
                          <button
                            onClick={() => handleRevoke(s.id)}
                            disabled={!!busy[s.id]}
                            className="text-sm px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50 transition"
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
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 font-medium">No VPN subscriptions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
