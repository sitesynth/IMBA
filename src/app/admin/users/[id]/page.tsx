'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { AdminUserDetail } from '@/lib/admin-api'
import { getUser, addBalance } from '@/lib/admin-api'

export default function AdminUserDetail() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [balance, setBalance] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getUser(userId)
        setUser(data)
        setBalance(data.balance?.toString() || '0')
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const handleAdjustBalance = async () => {
    if (!balance) return
    setUpdating(true)
    setUpdateError('')
    try {
      const amount = parseFloat(balance) - (user?.balance || 0)
      await addBalance(userId, amount, 'Manual adjustment via admin')
      const data = await getUser(userId)
      setUser(data)
      setBalance(data.balance?.toString())
    } catch (e) {
      setUpdateError((e as Error).message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!user) return <div className="p-8 text-center">User not found</div>

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User: {user.email}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div><dt className="font-medium text-gray-700">Email</dt><dd className="text-gray-900">{user.email}</dd></div>
            <div><dt className="font-medium text-gray-700">Name</dt><dd className="text-gray-900">{user.name || '—'}</dd></div>
            <div><dt className="font-medium text-gray-700">Plan</dt><dd className="text-gray-900">{user.plan || '—'}</dd></div>
            <div><dt className="font-medium text-gray-700">Balance</dt><dd className="text-gray-900 font-mono">${user.balance?.toFixed(2)}</dd></div>
            <div><dt className="font-medium text-gray-700">Status</dt><dd className="text-gray-900">{user.is_active ? '✓ Active' : '✗ Blocked'}</dd></div>
            <div><dt className="font-medium text-gray-700">Admin</dt><dd className="text-gray-900">{user.is_admin ? '✓ Yes' : '✗ No'}</dd></div>
            <div><dt className="font-medium text-gray-700">Created</dt><dd className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adjust Balance</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={updating}
                />
                <button
                  onClick={handleAdjustBalance}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
              {updateError && <p className="text-sm text-red-600 mt-2">{updateError}</p>}
            </div>
          </div>
        </div>
      </div>

      {user.payments && user.payments.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {user.payments.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">${p.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.note || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
