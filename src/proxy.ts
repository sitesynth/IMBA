import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const publicPaths = ['/', '/auth/login', '/auth/register']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicPaths.includes(path)
  const session = request.cookies.get('session')?.value
  const payload = await decrypt(session)

  if (!isPublic && !payload) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isPublic && payload && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
