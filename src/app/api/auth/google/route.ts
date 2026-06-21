import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import { buildAuthUrl, googleConfigured } from '@/lib/google'

export async function GET() {
  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL('/auth/login?error=google_not_configured', process.env.APP_URL ?? 'http://localhost:3100')
    )
  }
  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('g_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
    domain: process.env.NODE_ENV === 'production' ? '.imba.live' : undefined,
  })
  return NextResponse.redirect(buildAuthUrl(state))
}
