import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/terms', '/privacy-policy', '/refund']
const publicPrefixes = ['/blog', '/admin']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicPaths.includes(path) || publicPrefixes.some((p) => path.startsWith(p))
  const token = request.cookies.get('imba_token')?.value

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
