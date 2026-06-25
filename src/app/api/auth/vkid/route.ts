import { NextRequest, NextResponse } from 'next/server'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

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
