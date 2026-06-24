import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import crypto from 'node:crypto'
import { buildAuthUrl, googleConfigured } from '@/lib/google'

export async function GET(request: NextRequest) {
  const h = await headers()
  const origin = `https://${h.get('x-forwarded-host') ?? h.get('host') ?? 'imba.live'}`

  if (!googleConfigured()) {
    return NextResponse.redirect(new URL('/auth/login?error=google_not_configured', origin))
  }
  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('g_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return NextResponse.redirect(buildAuthUrl(state, origin))
}
