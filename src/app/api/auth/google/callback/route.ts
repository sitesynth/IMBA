import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { exchangeCodeForToken, redirectUri } from '@/lib/google'
import { setApiToken } from '@/lib/api'

const apiUrl = () => process.env.IMBA_API_URL ?? 'http://localhost:8100'

export async function GET(request: NextRequest) {
  const origin = `https://${(await headers()).get('host') ?? 'imba.live'}`
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('g_state')?.value
  cookieStore.delete('g_state')

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL('/auth/login?error=google_failed', origin))
  }

  try {
    const accessToken = await exchangeCodeForToken(code, origin)
    const res = await fetch(`${apiUrl()}/v1/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    })
    if (!res.ok) throw new Error('backend google auth failed')
    const { token } = await res.json()
    await setApiToken(token)
    return NextResponse.redirect(new URL('/dashboard', origin))
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=google_failed', origin))
  }
}
