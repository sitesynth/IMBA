import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch } from '@/lib/api'
import { TopupFlow } from '@/components/TopupFlow'
import type { PaymentProvider } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://imba.live'

async function createInvoice(provider: string, amount_usd: number) {
  'use server'
  const success_url = `${BASE_URL}/dashboard/billing/topup/result?status=success&provider=${provider}`
  const fail_url = `${BASE_URL}/dashboard/billing/topup/result?status=failed&provider=${provider}`
  const result = await apiFetch<{ payment_id: string; payment_url: string }>(
    '/v1/payments/invoice',
    { method: 'POST', body: JSON.stringify({ provider, amount_usd, success_url, fail_url }) },
  )
  return { payment_id: result.payment_id, payment_url: result.payment_url }
}

export default async function TopupPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const providers = await api.get<PaymentProvider[]>('/v1/payments/providers').catch(() => [])
  if (providers.length === 0) redirect('/dashboard/billing')

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const cur = user.currency ?? 'USD'

  return (
    <div className="fade-up max-w-lg space-y-6">
      <div>
        <a href="/dashboard/billing" className="pill pill-paper pill-sm inline-flex mb-6">
          ← Назад
        </a>
        <h1 className="display text-4xl mb-1">Пополнить баланс</h1>
        <p className="font-semibold text-ink/60">Мгновенное зачисление после оплаты</p>
      </div>

      <TopupFlow
        providers={providers}
        currency={cur}
        rates={rates}
        createInvoice={createInvoice}
      />
    </div>
  )
}
