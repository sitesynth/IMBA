import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { api } from '@/lib/api'
import { ApiCabinet, type ApiState } from './ApiCabinet'

export const metadata: Metadata = { title: 'IMBA API cabinet', robots: { index: false } }

export default async function ApiPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login?for=partner&redirect=%2Fdashboard%2Fapi')

  const state = await api.get<ApiState>('/v1/me/api').catch(() => null)
  return <ApiCabinet initial={state} email={user.email} />
}
