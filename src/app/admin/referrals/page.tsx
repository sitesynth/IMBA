'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Share2 } from 'lucide-react'
import { getReferralPrograms, toggleReferralProgram, AdminApiError, ReferralProgram } from '@/lib/admin-api'

export default function AdminReferrals() {
  const [programs, setPrograms] = useState<ReferralProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const data = await getReferralPrograms()
      setPrograms(data)
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

  const handleToggle = async (programId: string) => {
    try {
      await toggleReferralProgram(programId)
      await fetchPrograms()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  const totalEarned = programs.reduce((sum, p) => sum + p.total_earned, 0)
  const totalReferrals = programs.reduce((sum, p) => sum + p.total_referrals, 0)
  const totalCompleted = programs.reduce((sum, p) => sum + p.completed, 0)

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Share2 className="w-8 h-8" /> Referral Programs
        </h1>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referrer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referrals</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Completed</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Earned</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Bonuses</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {programs.map((prog) => (
              <tr key={prog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{prog.referrer_email || '—'}</td>
                <td className="px-6 py-4 text-sm font-mono text-blue-600">{prog.referral_code}</td>
                <td className="px-6 py-4 text-sm font-bold">{prog.total_referrals}</td>
                <td className="px-6 py-4 text-sm">{prog.completed}</td>
                <td className="px-6 py-4 text-sm font-mono">${prog.total_earned.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-xs">
                  Ref: ${prog.referrer_bonus} / User: ${prog.referee_bonus}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={prog.is_active ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                    {prog.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/admin/referrals/${prog.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                    <button
                      onClick={() => handleToggle(prog.id)}
                      className="text-orange-600 hover:underline"
                    >
                      {prog.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
