import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/login', '/auth/register', '/admin/login', '/terms', '/privacy-policy']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicPaths.includes(path)
  const token = request.cookies.get('imba_token')?.value

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isPublic && token && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
