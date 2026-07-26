'use client'
import { useEffect, useState } from 'react'
import { Send, Inbox } from 'lucide-react'
import { getNotifications, sendNotification, AdminApiError, Notification } from '@/lib/admin-api'

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    message: '',
    type: 'admin_message',
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (e) {
      if (e instanceof AdminApiError) {
        setError(e.message)
      } else {
        setError((e as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!formData.user_id || !formData.title || !formData.message) {
      setError('All fields are required')
      return
    }

    setSending(true)
    try {
      await sendNotification(formData)
      setFormData({ user_id: '', title: '', message: '', type: 'admin_message' })
      setError('')
      await fetchNotifications()
    } catch (e) {
      if (e instanceof AdminApiError) {
        setError(e.message)
      } else {
        setError((e as Error).message)
      }
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-3xl font-bold">Notifications</h1>

      {/* Send Notification Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" /> Send Notification
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="text"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              placeholder="Enter user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Notification title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Notification message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Inbox className="w-5 h-5" />
          <h2 className="text-xl font-bold">Recent Notifications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Read</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{n.email || '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium">{n.title}</td>
                  <td className="px-6 py-4 text-sm">{n.notification_type}</td>
                  <td className="px-6 py-4 text-sm">{n.is_read ? '✓' : '✗'}</td>
                  <td className="px-6 py-4 text-sm">{new Date(n.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
