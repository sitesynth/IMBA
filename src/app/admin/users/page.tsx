'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUsers, addBalance, toggleUser, AdminUser } from '@/lib/admin-api'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [balanceModal, setBalanceModal] = useState<{ userId: string; email: string; current: number } | null>(null)
  const [bulkModal, setBulkModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await getUsers({ search: search || undefined, limit: 200 })
      setUsers(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === users.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(users.map(u => u.user_id)))
    }
  }

  async function handleAddBalance(userId: string, delta: number, noteText: string) {
    setSaving(true)
    try {
      await addBalance(userId, delta, noteText || 'Manual admin top-up')
    } finally {
      setSaving(false)
    }
  }

  async function submitSingle() {
    if (!balanceModal || !amount) return
    const delta = parseFloat(amount)
    if (isNaN(delta)) return
    await handleAddBalance(balanceModal.userId, delta, note)
    setBalanceModal(null)
    setAmount('')
    setNote('')
    load()
  }

  async function submitBulk() {
    if (!amount || selected.size === 0) return
    const delta = parseFloat(amount)
    if (isNaN(delta)) return
    setSaving(true)
    try {
      await Promise.all([...selected].map(id => addBalance(id, delta, note || 'Bulk admin top-up')))
      setSelected(new Set())
      setBulkModal(false)
      setAmount('')
      setNote('')
      load()
    } finally {
      setSaving(false)
    }
  }

  const filtered = users.filter(u =>
    !search || u.email.toLowerCase().includes(search.toLowerCase()) || (u.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        {selected.size > 0 && (
          <button
            onClick={() => { setAmount(''); setNote(''); setBulkModal(true) }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
          >
            + Balance for {selected.size} selected
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Search by email or name..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={load} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200">
          Search
        </button>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.user_id} className={`hover:bg-gray-50 ${selected.has(u.user_id) ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(u.user_id)} onChange={() => toggleSelect(u.user_id)} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.plan || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">${u.balance?.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">
                  {u.is_active
                    ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    : <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocked</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button
                    onClick={() => { setAmount(''); setNote(''); setBalanceModal({ userId: u.user_id, email: u.email, current: u.balance || 0 }) }}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                  >
                    + Balance
                  </button>
                  <Link href={`/admin/users/${u.user_id}`} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Single user balance modal */}
      {balanceModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-1">Add Balance</h2>
            <p className="text-sm text-gray-500 mb-4">{balanceModal.email} · current: ${balanceModal.current.toFixed(2)}</p>
            <div className="space-y-3">
              <input
                type="number"
                step="0.01"
                placeholder="Amount (e.g. 5.00)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2 pt-1">
                <button onClick={() => setBalanceModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                <button
                  onClick={submitSingle}
                  disabled={saving || !amount}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk balance modal */}
      {bulkModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-1">Bulk Add Balance</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.size} users selected</p>
            <div className="space-y-3">
              <input
                type="number"
                step="0.01"
                placeholder="Amount per user"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2 pt-1">
                <button onClick={() => setBulkModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                <button
                  onClick={submitBulk}
                  disabled={saving || !amount}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : `Add to ${selected.size} users`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
