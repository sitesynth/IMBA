import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { setApiToken } from '@/lib/api'

const TELEGRAM_BOT_ID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID ?? ''
const TELEGRAM_SECRET = process.env.TELEGRAM_CLIENT_SECRET ?? ''
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
    const dest = isLink ? `${origin}/dashboard?error=tg_cancelled` : `${origin}/auth/login?error=tg_cancelled`
    return NextResponse.redirect(dest)
  }

  const redirectUri = `${origin}/api/auth/telegram/callback`

  // Exchange code for tokens at Telegram OIDC token endpoint
  const tokenRes = await fetch('https://oauth.telegram.org/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: TELEGRAM_BOT_ID,
      client_secret: TELEGRAM_SECRET,
    }),
  }).catch(() => null)

  if (!tokenRes?.ok) {
    const dest = isLink ? `${origin}/dashboard?error=tg_failed` : `${origin}/auth/login?error=tg_failed`
    return NextResponse.redirect(dest)
  }

  const tokenData = await tokenRes.json()
  const idToken = tokenData.id_token
  if (!idToken) {
    const dest = isLink ? `${origin}/dashboard?error=tg_failed` : `${origin}/auth/login?error=tg_failed`
    return NextResponse.redirect(dest)
  }

  // Decode JWT payload (trusted — received directly from Telegram token endpoint over TLS)
  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString())
  const telegramId = payload.sub
  const name = payload.name || `Telegram ${telegramId}`

  // ── Link mode: bind Telegram to existing account, activate Start trial ──
  if (isLink) {
    const userToken = request.cookies.get('imba_token')?.value
    if (!userToken) return NextResponse.redirect(`${origin}/auth/login`)

    const linkRes = await fetch(`${apiUrl()}/v1/me/telegram/oidc-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ id_token: idToken, fingerprint: fp || null }),
    }).catch(() => null)

    if (!linkRes?.ok) {
      const err = await linkRes?.json().catch(() => ({}))
      const msg = encodeURIComponent(err?.detail || 'tg_link_failed')
      return NextResponse.redirect(`${origin}/dashboard?error=${msg}`)
    }

    return NextResponse.redirect(`${origin}/dashboard?activated=telegram`)
  }

  // ── Login/register mode ──
  const apiRes = await fetch(`${apiUrl()}/v1/auth/telegram/oidc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken, fingerprint: fp ?? null }),
  }).catch(() => null)

  if (!apiRes?.ok) {
    const err = await apiRes?.json().catch(() => ({}))
    const msg = err?.detail === 'Триал уже был активирован на этом устройстве'
      ? 'trial_device'
      : 'tg_failed'
    return NextResponse.redirect(`${origin}/auth/login?error=${msg}`)
  }

  const { token } = await apiRes.json()
  await setApiToken(token)
  return NextResponse.redirect(`${origin}/dashboard`)
}
