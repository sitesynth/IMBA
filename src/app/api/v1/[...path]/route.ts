import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.IMBA_API_URL || 'http://localhost:8100'
const TOKEN_COOKIE = 'imba_token'

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const target = `${BACKEND}/v1/${path.join('/')}`
  const url = new URL(target)
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v))

  const headers = new Headers()
  const ct = req.headers.get('content-type')
  if (ct) headers.set('Content-Type', ct)

  // Try next/headers cookies() first, fall back to raw Cookie header (nginx proxy compatibility)
  const store = await cookies()
  let cookieToken = store.get(TOKEN_COOKIE)?.value
  if (!cookieToken) {
    const raw = req.headers.get('cookie') ?? ''
    const match = raw.match(/(?:^|;\s*)imba_token=([^;]+)/)
    if (match) cookieToken = decodeURIComponent(match[1])
  }
  if (cookieToken) {
    headers.set('Authorization', `Bearer ${cookieToken}`)
  } else {
    const incoming = req.headers.get('Authorization')
    if (incoming) headers.set('Authorization', incoming)
  }

  const res = await fetch(url.toString(), {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
  })

  return new NextResponse(res.body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
