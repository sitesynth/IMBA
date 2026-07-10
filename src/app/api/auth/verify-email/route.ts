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

  const response = NextResponse.json({ ok: true })

  const refCode = request.cookies.get('imba_ref')?.value
  if (refCode && /^[a-zA-Z0-9_-]{4,30}$/.test(refCode)) {
    try {
      await fetch(`${apiUrl()}/v1/promotions/referral/apply/${refCode}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      })
    } catch {
      // Non-critical — don't fail verification if apply fails
    }
    response.cookies.set('imba_ref', '', { maxAge: 0, path: '/' })
  }

  return response
}
