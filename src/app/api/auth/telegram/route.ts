import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

export async function POST(request: NextRequest) {
  const h = await headers()
  const origin = `https://${h.get('x-real-host') ?? h.get('x-forwarded-host') ?? h.get('host') ?? 'imba.live'}`

  try {
    const body = await request.json()
    const res = await fetch(`${apiUrl()}/v1/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Auth failed' }))
      return NextResponse.json({ error: err.detail }, { status: res.status })
    }
    const { token } = await res.json()
    await setApiToken(token)
    return NextResponse.json({ ok: true, redirect: '/dashboard' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
