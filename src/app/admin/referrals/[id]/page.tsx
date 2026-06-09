'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { getReferralPrograms, getReferralConversions, AdminApiError, ReferralProgram, ReferralConversion } from '@/lib/admin-api'

export default function ReferralDetail() {
  const params = useParams()
  const programId = params.id as string

  const [program, setProgram] = useState<ReferralProgram | null>(null)
  const [conversions, setConversions] = useState<ReferralConversion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!programId) return
    fetchData()
  }, [programId])

  const fetchData = async () => {
    try {
      // Get program details
      const programs = await getReferralPrograms()
      const prog = programs.find(p => p.id === programId)
      setProgram(prog || null)

      // Get conversions for this program
      const data = await getReferralConversions(programId)
      setConversions(data)
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

  if (loading) return <div className="p-8">Loading...</div>
  if (!program) return <div className="p-8">Program not found</div>

  const completed = conversions.filter(c => c.status === 'completed').length
  const pending = conversions.filter(c => c.status === 'pending').length

  return (
    <div className="max-w-6xl space-y-8">
      <Link href="/admin/referrals" className="text-blue-600 hover:underline flex items-center gap-2 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Referrals
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-4">{program.referral_code}</h1>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600">Referrer</p>
            <p className="text-lg font-medium">{program.referrer_email || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-lg font-medium ${program.is_active ? 'text-green-600' : 'text-gray-400'}`}>
              {program.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Referrer Bonus</p>
            <p className="text-lg font-mono font-bold">${program.referrer_bonus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Referee Bonus</p>
            <p className="text-lg font-mono font-bold">${program.referee_bonus}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{conversions.length}</div>
            <div className="text-sm text-gray-600">Total Conversions</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Conversions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-bold">Conversions</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referee Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referrer Bonus</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referee Bonus</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Converted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {conversions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No conversions yet</td>
              </tr>
            ) : (
              conversions.map((conv) => (
                <tr key={conv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{conv.referee_email || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      conv.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {conv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={conv.referrer_bonus_paid ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                      {conv.referrer_bonus_paid ? '✓ Paid' : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={conv.referee_bonus_paid ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                      {conv.referee_bonus_paid ? '✓ Paid' : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{conv.completed_at ? new Date(conv.completed_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
