import { NextRequest, NextResponse } from 'next/server'

const API = process.env.IMBA_API_URL ?? 'http://138.2.134.17:8100'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('imba_token')?.value
  if (!token) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

  const p = request.nextUrl.searchParams
  const provider = p.get('provider') ?? ''
  const amount_usd = p.get('amount_usd') ? Number(p.get('amount_usd')) : undefined
  const amount_rub = p.get('amount_rub') ? Number(p.get('amount_rub')) : undefined
  const success_url = p.get('success_url') ?? undefined
  const fail_url = p.get('fail_url') ?? undefined
  const payment_system_id = p.get('payment_system_id') ?? undefined

  if (!provider) {
    return NextResponse.json({ detail: 'provider required' }, { status: 400 })
  }

  const body: Record<string, unknown> = { provider }
  if (amount_usd !== undefined) body.amount_usd = amount_usd
  if (amount_rub !== undefined) body.amount_rub = amount_rub
  if (success_url) body.success_url = success_url
  if (fail_url) body.fail_url = fail_url
  if (payment_system_id) body.payment_system_id = payment_system_id

  const res = await fetch(`${API}/v1/payments/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': request.headers.get('origin') ?? '',
    },
    body: JSON.stringify(body),
  }).catch(() => null)

  const data = await res?.json().catch(() => ({}))
  return NextResponse.json(data, {
    status: res?.status ?? 500,
    headers: { 'Cache-Control': 'no-store' },
  })
}
