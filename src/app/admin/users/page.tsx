'use client'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getUsers, getUser, addBalance, toggleUser, deleteUser, AdminUser, AdminUserDetail } from '@/lib/admin-api'

function UserRow({ u, index, onRefresh, onDeleted, selected, onSelect }: { u: AdminUser; index: number; onRefresh: () => void; onDeleted: (id: string) => void; selected: boolean; onSelect: (e: React.MouseEvent) => void }) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<AdminUserDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Balance modal state
  const [showBalance, setShowBalance] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete state
  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function toggle() {
    if (!open) {
      setOpen(true)
      if (!detail) {
        setLoadingDetail(true)
        try { setDetail(await getUser(u.user_id)) } catch {}
        finally { setLoadingDetail(false) }
      }
    } else {
      setOpen(false)
    }
  }

  async function submitBalance() {
    const delta = parseFloat(amount)
    if (isNaN(delta)) return
    setSaving(true)
    try {
      await addBalance(u.user_id, delta, note || 'Manual admin top-up')
      setShowBalance(false)
      setAmount('')
      setNote('')
      onRefresh()
    } finally { setSaving(false) }
  }

  async function submitDelete() {
    if (!deletePassword) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteUser(u.user_id, deletePassword)
      onDeleted(u.user_id)
    } catch (e) {
      setDeleteError((e as Error).message || 'Ошибка удаления')
      setDeleting(false)
    }
  }

  return (
    <>
      <tr
        className={`hover:bg-gray-50 cursor-pointer ${open ? 'bg-blue-50' : ''} ${selected ? 'bg-blue-50' : ''}`}
        onClick={toggle}
      >
        <td className="px-4 py-3" onClick={onSelect}>
          <input type="checkbox" checked={selected} onChange={() => {}} />
        </td>
        <td className="px-4 py-3 text-sm text-gray-400 tabular-nums">{index + 1}</td>
        <td className="px-4 py-3 text-sm text-gray-900">
          <div>{u.email}</div>
          {u.telegram_id && <div className="text-xs text-blue-500">TG: {u.telegram_id}</div>}
          {u.vk_id && <div className="text-xs text-indigo-500">VK: {u.vk_id}</div>}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">{u.name || '—'}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{u.plan || '—'}</td>
        <td className="px-4 py-3 text-sm text-gray-900 font-mono">${u.balance?.toFixed(2)}</td>
        <td className="px-4 py-3 text-sm font-mono text-green-700">${(u.total_paid ?? 0).toFixed(2)}</td>
        <td className="px-4 py-3 text-xs text-gray-500">{u.source || '—'}</td>
        <td className="px-4 py-3 text-xs text-gray-500">{u.city || '—'}</td>
        <td className="px-4 py-3 text-sm">
          {u.is_active
            ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
            : <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocked</span>}
        </td>
        <td className="px-3 py-3 text-xs text-gray-500 tabular-nums whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('ru')}</td>
        <td className="px-4 py-3 text-sm text-gray-400">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={12} className="px-0 py-0 border-b border-blue-100">
            <div className="bg-blue-50 px-6 py-5 space-y-5">
              {loadingDetail ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : detail ? (
                <>
                  {/* Info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">User ID</div>
                      <div className="font-mono text-xs text-gray-700 break-all">{detail.user_id}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</div>
                      <div>{detail.email}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Name</div>
                      <div>{detail.name || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Balance</div>
                      <div className="font-mono font-bold">${detail.balance?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Plan</div>
                      <div>{detail.plan || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</div>
                      <div>{detail.is_active ? '✅ Active' : '🚫 Blocked'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Admin</div>
                      <div>{detail.is_admin ? '🔑 Yes' : 'No'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Registered</div>
                      <div>{new Date(detail.created_at).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Services */}
                  {(detail.esims?.length > 0 || detail.vpns?.length > 0 || detail.cards?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {detail.esims?.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">eSIMs ({detail.esims.length})</div>
                          {detail.esims.map(e => (
                            <div key={e.iccid} className="font-mono text-xs text-gray-600">{e.iccid} · {e.status}</div>
                          ))}
                        </div>
                      )}
                      {detail.vpns?.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">VPN ({detail.vpns.length})</div>
                          {detail.vpns.map(v => (
                            <div key={v.vpn_id} className="text-xs text-gray-600">{v.status} · expires {new Date(v.expires_at).toLocaleDateString()}</div>
                          ))}
                        </div>
                      )}
                      {detail.cards?.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Cards ({detail.cards.length})</div>
                          {detail.cards.map(c => (
                            <div key={c.card_id} className="text-xs text-gray-600">*{c.last4} · {c.status}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={e => { e.stopPropagation(); setShowBalance(true) }}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200"
                    >
                      + Balance
                    </button>
                    <button
                      onClick={async e => { e.stopPropagation(); await toggleUser(u.user_id); onRefresh() }}
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-200"
                    >
                      {u.is_active ? 'Block' : 'Unblock'}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setShowDelete(true); setDeleteError('') }}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200"
                    >
                      Delete user
                    </button>
                  </div>

                  {/* Inline balance form */}
                  {showBalance && (
                    <div className="border border-green-200 rounded-lg p-4 bg-white space-y-2 max-w-sm" onClick={e => e.stopPropagation()}>
                      <div className="text-sm font-semibold">Add Balance</div>
                      <input
                        type="number" step="0.01" placeholder="Amount (USD)" value={amount}
                        onChange={e => setAmount(e.target.value)} autoFocus
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      />
                      <input
                        type="text" placeholder="Note (optional)" value={note}
                        onChange={e => setNote(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setShowBalance(false)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs">Cancel</button>
                        <button onClick={submitBalance} disabled={saving || !amount} className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-semibold disabled:opacity-50">
                          {saving ? 'Saving...' : 'Add'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline delete form */}
                  {showDelete && (
                    <div className="border border-red-200 rounded-lg p-4 bg-white space-y-2 max-w-sm" onClick={e => e.stopPropagation()}>
                      <div className="text-sm font-semibold text-red-700">Удалить пользователя</div>
                      <div className="text-xs text-gray-500">Введите ваш пароль администратора для подтверждения. Действие необратимо.</div>
                      <input
                        type="password" placeholder="Пароль администратора" value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)} autoFocus
                        className="w-full border border-red-300 rounded px-3 py-1.5 text-sm"
                      />
                      {deleteError && <div className="text-xs text-red-600">{deleteError}</div>}
                      <div className="flex gap-2">
                        <button onClick={() => { setShowDelete(false); setDeletePassword('') }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs">Cancel</button>
                        <button onClick={submitDelete} disabled={deleting || !deletePassword} className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold disabled:opacity-50">
                          {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkModal, setBulkModal] = useState(false)
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false)
  const [bulkDeletePassword, setBulkDeletePassword] = useState('')
  const [bulkDeleteError, setBulkDeleteError] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [sortKey, setSortKey] = useState<string>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  async function load() {
    setLoading(true)
    try {
      const data = await getUsers({ search: search || undefined, status: statusFilter || undefined, source: sourceFilter || undefined, limit: 200 })
      setUsers(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === users.length) setSelected(new Set())
    else setSelected(new Set(users.map(u => u.user_id)))
  }

  async function submitBulkDelete() {
    if (!bulkDeletePassword || selected.size === 0) return
    setSaving(true)
    setBulkDeleteError('')
    try {
      await Promise.all([...selected].map(id => deleteUser(id, bulkDeletePassword)))
      setSelected(new Set())
      setBulkDeleteModal(false)
      setBulkDeletePassword('')
      await load()
    } catch (e) {
      setBulkDeleteError((e as Error).message || 'Ошибка удаления')
    } finally { setSaving(false) }
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
    } finally { setSaving(false) }
  }

  const sortedUsers = [...users].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey] ?? ''
    const bv = (b as unknown as Record<string, unknown>)[sortKey] ?? ''
    const cmp = typeof av === 'number' && typeof bv === 'number'
      ? av - bv
      : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortTh = ({ col, label }: { col: string; label: string }) => (
    <th
      onClick={() => handleSort(col)}
      className={`px-4 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-gray-100 transition-colors ${sortKey === col ? 'text-blue-600' : 'text-gray-700'}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === col
          ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          : <span className="opacity-20 text-[10px]">↕</span>}
      </span>
    </th>
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        {selected.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => { setAmount(''); setNote(''); setBulkModal(true) }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
            >
              + Balance for {selected.size} selected
            </button>
            <button
              onClick={() => { setBulkDeletePassword(''); setBulkDeleteError(''); setBulkDeleteModal(true) }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Delete {selected.size} selected
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Email, name, Telegram ID..."
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 select-arrow">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 select-arrow">
          <option value="">All sources</option>
          <option value="vk">VK</option>
          <option value="google">Google</option>
          <option value="email">Email</option>
        </select>
        <button onClick={load} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          Search
        </button>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.size === sortedUsers.length && sortedUsers.length > 0} onChange={toggleAll} />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">#</th>
                <SortTh col="email" label="Email / Contact" />
                <SortTh col="name" label="Name" />
                <SortTh col="plan" label="Plan" />
                <SortTh col="balance" label="Balance" />
                <SortTh col="total_paid" label="Total paid" />
                <SortTh col="source" label="Source" />
                <SortTh col="city" label="City" />
                <SortTh col="is_active" label="Status" />
                <SortTh col="created_at" label="Created" />
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={12} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : sortedUsers.map((u, i) => (
                <UserRow
                  key={u.user_id}
                  u={u}
                  index={i}
                  onRefresh={load}
                  onDeleted={(id) => setUsers(prev => prev.filter(x => x.user_id !== id))}
                  selected={selected.has(u.user_id)}
                  onSelect={(e) => toggleSelect(u.user_id, e)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk delete modal */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-red-700 mb-1">Удалить {selected.size} пользователей</h2>
            <p className="text-sm text-gray-500 mb-4">Действие необратимо. Введите пароль администратора для подтверждения.</p>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Пароль администратора"
                value={bulkDeletePassword}
                onChange={e => setBulkDeletePassword(e.target.value)}
                autoFocus
                className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {bulkDeleteError && <p className="text-xs text-red-600">{bulkDeleteError}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setBulkDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                <button
                  onClick={submitBulkDelete}
                  disabled={saving || !bulkDeletePassword}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : `Delete ${selected.size}`}
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
              <input type="number" step="0.01" placeholder="Amount per user" value={amount}
                onChange={e => setAmount(e.target.value)} autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input type="text" placeholder="Note (optional)" value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2 pt-1">
                <button onClick={() => setBulkModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                <button onClick={submitBulk} disabled={saving || !amount}
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
