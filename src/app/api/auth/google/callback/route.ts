import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { exchangeCodeForProfile, upsertGoogleUser } from '@/lib/google'
import { createSession } from '@/lib/session'

const base = () => process.env.APP_URL ?? 'http://localhost:3100'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('g_state')?.value
  cookieStore.delete('g_state')

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL('/auth/login?error=google_failed', base()))
  }

  try {
    const profile = await exchangeCodeForProfile(code)
    const userId = await upsertGoogleUser(profile)
    await createSession(userId)
    return NextResponse.redirect(new URL('/dashboard', base()))
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=google_failed', base()))
  }
}
