import { NextRequest, NextResponse } from 'next/server'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

export async function POST(request: NextRequest) {
  const { init_data } = await request.json()
  if (!init_data) {
    return NextResponse.json({ error: 'Missing init_data' }, { status: 400 })
  }

  const res = await fetch(`${apiUrl()}/v1/auth/tg-webapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data }),
  }).catch(() => null)

  if (!res?.ok) {
    const err = await res?.json().catch(() => ({}))
    return NextResponse.json({ error: err?.detail || 'Auth failed' }, { status: res?.status || 500 })
  }

  const { token } = await res.json()
  await setApiToken(token)
  return NextResponse.json({ ok: true })
}
