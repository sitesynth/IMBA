'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupport, SupportTicket } from '@/lib/admin-api'

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getSupport({ limit: 100 })
        setTickets(data)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Tickets</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ticket ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((t) => (
              <tr key={t.ticket_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-700">{t.ticket_id.slice(0, 12)}...</td>
                <td className="px-6 py-4 text-sm text-gray-700">{t.email || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{t.subject}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    t.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                    t.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(t.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
