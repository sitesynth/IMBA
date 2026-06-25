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
  const rawState = decodeURIComponent(request.nextUrl.searchParams.get('state') || '')
  const [fp, mode] = rawState.split('__')

  const isLink = mode === 'link'

  if (!code) {
    const dest = isLink ? `${origin}/dashboard?error=vk_cancelled` : `${origin}/auth/login?error=vk_cancelled`
    return NextResponse.redirect(dest)
  }

  const redirectUri = `${origin}/api/auth/vk/callback`

  const tokenRes = await fetch(
    `https://oauth.vk.com/access_token?client_id=${VK_CLIENT_ID}&client_secret=${VK_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
  ).catch(() => null)

  if (!tokenRes?.ok) {
    const dest = isLink ? `${origin}/dashboard?error=vk_failed` : `${origin}/auth/login?error=vk_failed`
    return NextResponse.redirect(dest)
  }

  const tokenData = await tokenRes.json()
  if (tokenData.error || !tokenData.user_id) {
    const dest = isLink ? `${origin}/dashboard?error=vk_failed` : `${origin}/auth/login?error=vk_failed`
    return NextResponse.redirect(dest)
  }

  const { access_token, user_id, first_name, last_name } = tokenData

  // ── Link mode: bind VK to existing account, activate Start trial ──
  if (isLink) {
    const userToken = request.cookies.get('imba_token')?.value
    if (!userToken) return NextResponse.redirect(`${origin}/auth/login`)

    const linkRes = await fetch(`${apiUrl()}/v1/me/vk/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ vk_id: user_id, access_token, fingerprint: fp || null }),
    }).catch(() => null)

    if (!linkRes?.ok) {
      const err = await linkRes?.json().catch(() => ({}))
      const msg = encodeURIComponent(err?.detail || 'vk_link_failed')
      return NextResponse.redirect(`${origin}/dashboard?error=${msg}`)
    }

    return NextResponse.redirect(`${origin}/dashboard?activated=vk`)
  }

  // ── Login/register mode ──
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
