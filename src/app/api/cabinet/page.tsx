import { api } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { Overview } from './Overview'
import type { ApiState } from './types'

export default async function CabinetHome() {
  const user = await getCurrentUser()
  const state = await api.get<ApiState>('/v1/me/api').catch(() => null)
  return <Overview initial={state} email={user?.email ?? ''} />
}
