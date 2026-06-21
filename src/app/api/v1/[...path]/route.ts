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

  const store = await cookies()
  const token = store.get(TOKEN_COOKIE)?.value
  if (token) headers.set('Authorization', `Bearer ${token}`)

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
