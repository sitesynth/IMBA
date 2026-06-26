import { NextRequest, NextResponse } from 'next/server'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

// VK redirects here after auth in Redirect mode — forward params to client callback page
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const device_id = searchParams.get('device_id')
  const state = searchParams.get('state')
  const target = new URL('/auth/vk-callback', origin)
  if (code) target.searchParams.set('code', code)
  if (device_id) target.searchParams.set('device_id', device_id)
  if (state) target.searchParams.set('state', state)
  return NextResponse.redirect(target)
}

export async function POST(request: NextRequest) {
  const { vk_id, access_token, name, fingerprint } = await request.json()

  const apiRes = await fetch(`${apiUrl()}/v1/auth/vk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vk_id,
      name: name || `VK ${vk_id}`,
      access_token,
      fingerprint: fingerprint ?? null,
    }),
  }).catch(() => null)

  if (!apiRes?.ok) {
    const err = await apiRes?.json().catch(() => ({}))
    return NextResponse.json(
      { error: err?.detail || 'vk_failed' },
      { status: apiRes?.status || 500 },
    )
  }

  const { token } = await apiRes.json()
  await setApiToken(token)
  return NextResponse.json({ ok: true })
}
