import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/check-email', '/auth/verify-email', '/auth/tg-webapp', '/auth/vk-callback', '/terms', '/privacy-policy', '/refund']
const publicPrefixes = ['/blog', '/admin']

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp) return true
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicPaths.includes(path) || publicPrefixes.some((p) => path.startsWith(p))
  const token = request.cookies.get('imba_token')?.value

  if (token && isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('imba_token')
    return response
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Only redirect root for authenticated users — NOT auth/* pages.
  // Redirecting /auth/login → /dashboard when token is stale creates an infinite loop
  // because the dashboard redirects back to /auth/login when /v1/me fails.
  if (path === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
