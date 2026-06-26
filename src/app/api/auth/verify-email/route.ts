import { NextRequest, NextResponse } from 'next/server'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

export async function POST(request: NextRequest) {
  const { token } = await request.json()

  const apiRes = await fetch(`${apiUrl()}/v1/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).catch(() => null)

  if (!apiRes?.ok) {
    const err = await apiRes?.json().catch(() => ({}))
    return NextResponse.json(
      { error: err?.detail || 'Ссылка недействительна' },
      { status: apiRes?.status || 500 },
    )
  }

  const { token: jwt } = await apiRes.json()
  await setApiToken(jwt)
  return NextResponse.json({ ok: true })
}
