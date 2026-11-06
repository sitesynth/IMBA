import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { TopupForm } from './TopupForm'
import type { ApiState, ApiTopup } from '../types'

export const metadata: Metadata = { title: 'Top up' }

export default async function TopupPage() {
  const [state, topups] = await Promise.all([
    api.get<ApiState>('/v1/me/api').catch(() => null),
    api.get<{ topups: ApiTopup[] }>('/v1/me/api/topups').catch(() => ({ topups: [] as ApiTopup[] })),
  ])
  if (state && !state.enabled) {
    return (
      <div className="panel fade-up">
        <h1 className="display text-3xl">Top up</h1>
        <p className="font-semibold text-ink/70 mt-3">
          Create your partner account first: it has its own balance, which you top up here.{' '}
          <Link href="/api/cabinet" className="underline underline-offset-2 text-ink">Go to Overview</Link>
        </p>
      </div>
    )
  }
  return <TopupForm balance={state?.balance_usd ?? 0} topups={topups.topups} />
}
