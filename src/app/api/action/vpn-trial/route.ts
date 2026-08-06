import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API = process.env.IMBA_API_URL ?? 'http://138.2.134.17:8100'

export async function POST() {
  const jar = await cookies()
  const token = jar.get('imba_token')?.value
  if (!token) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`${API}/v1/me/vpn/trial-activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  }).catch(() => null)

  const data = await res?.json().catch(() => ({}))
  return NextResponse.json(data, { status: res?.status ?? 500, headers: { 'Cache-Control': 'no-store' } })
}
