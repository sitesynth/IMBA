'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveAdminToken, AdminApiError } from '@/lib/admin-api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      saveAdminToken(token)
      const res = await fetch('http://138.2.134.17:8100/v1/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) {
        localStorage.removeItem('imba_admin')
        setError('Invalid token')
        setLoading(false)
        return
      }
      router.push('/admin/stats')
    } catch (err) {
      localStorage.removeItem('imba_admin')
      setError('Connection error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">IMBA Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JWT Token
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your JWT token here"
              required
              rows={4}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
