import { NextRequest, NextResponse } from 'next/server'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams
  const code = p.get('code') ?? ''
  const fingerprint = p.get('fingerprint') ?? null

  const token = request.cookies.get('imba_token')?.value
  if (!token) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`${apiUrl()}/v1/me/promo/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ code, fingerprint }),
  }).catch(() => null)

  if (!res?.ok) {
    const err = await res?.json().catch(() => ({}))
    return NextResponse.json({ detail: err?.detail || 'Неверный промокод' }, { status: res?.status || 500 })
  }
  return NextResponse.json(await res.json())
}
