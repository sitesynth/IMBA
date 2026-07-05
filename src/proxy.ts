import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/check-email', '/auth/verify-email', '/auth/tg-webapp', '/auth/vk-callback', '/terms', '/privacy-policy', '/refund']
const publicPrefixes = ['/blog']

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
  const hostname = request.nextUrl.hostname
  const isUsdcLu = hostname === 'usdc.lu' || hostname === 'www.usdc.lu'

  // ── usdc.lu routing ───────────────────────────────────────────────────────
  if (isUsdcLu) {
    if (path === '/' || path === '') {
      return NextResponse.rewrite(new URL('/usdc', request.url))
    }
    if (path === '/privacy-policy' || path === '/privacy-policy.html') {
      return NextResponse.rewrite(new URL('/usdc/privacy-policy', request.url))
    }
    // /admin/* passes through to the admin panel
    if (path.startsWith('/admin')) {
      return NextResponse.next()
    }
    // Everything else on usdc.lu → home
    return NextResponse.redirect(new URL('https://usdc.lu/', request.url))
  }

  // ── Admin does not exist on imba.live — hard 404, no hints ───────────────
  if (path.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 })
  }

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
