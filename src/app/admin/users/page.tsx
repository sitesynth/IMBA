'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUsers, AdminUser } from '@/lib/admin-api'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers({ limit: 100 })
        setUsers(data)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{u.name || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{u.plan || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-mono">${u.balance?.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  {u.is_active ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocked</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  <Link href={`/admin/users/${u.user_id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
