import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { setApiToken } from '@/lib/api'

const VK_CLIENT_ID = process.env.VK_CLIENT_ID ?? ''
const VK_CLIENT_SECRET = process.env.VK_CLIENT_SECRET ?? ''
const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

export async function GET(request: NextRequest) {
  const h = await headers()
  const host = h.get('x-real-host') ?? h.get('x-forwarded-host') ?? h.get('host') ?? 'imba.live'
  const origin = `https://${host}`

  const code = request.nextUrl.searchParams.get('code')
  const fp = request.nextUrl.searchParams.get('state') || null

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=vk_cancelled`)
  }

  const redirectUri = `${origin}/api/auth/vk/callback`

  const tokenRes = await fetch(
    `https://oauth.vk.com/access_token?client_id=${VK_CLIENT_ID}&client_secret=${VK_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
  ).catch(() => null)

  if (!tokenRes?.ok) {
    return NextResponse.redirect(`${origin}/auth/login?error=vk_failed`)
  }

  const tokenData = await tokenRes.json()
  if (tokenData.error || !tokenData.user_id) {
    return NextResponse.redirect(`${origin}/auth/login?error=vk_failed`)
  }

  const { access_token, user_id, first_name, last_name } = tokenData
  const name = [first_name, last_name].filter(Boolean).join(' ') || `VK ${user_id}`

  const apiRes = await fetch(`${apiUrl()}/v1/auth/vk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vk_id: user_id, name, access_token, fingerprint: fp ?? null }),
  }).catch(() => null)

  if (!apiRes?.ok) {
    const err = await apiRes?.json().catch(() => ({}))
    const msg = err?.detail === 'Триал уже был активирован на этом устройстве'
      ? 'trial_device'
      : 'vk_failed'
    return NextResponse.redirect(`${origin}/auth/login?error=${msg}`)
  }

  const { token } = await apiRes.json()
  await setApiToken(token)
  return NextResponse.redirect(`${origin}/dashboard`)
}
