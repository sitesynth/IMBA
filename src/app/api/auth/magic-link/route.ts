import { NextRequest, NextResponse } from 'next/server'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'
const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? 'https://imba.live'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, email, token } = body

  if (action === 'request') {
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const res = await fetch(`${apiUrl()}/v1/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, frontend_url: appUrl() }),
    }).catch(() => null)

    if (!res?.ok) {
      const err = await res?.json().catch(() => ({}))
      return NextResponse.json({ error: err?.detail || 'Request failed' }, { status: res?.status || 500 })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'verify') {
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const res = await fetch(`${apiUrl()}/v1/auth/magic-link/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => null)

    if (!res?.ok) {
      const err = await res?.json().catch(() => ({}))
      return NextResponse.json({ error: err?.detail || 'Invalid or expired link' }, { status: res?.status || 500 })
    }

    const { token: jwt } = await res.json()
    await setApiToken(jwt)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
