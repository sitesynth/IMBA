import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch } from '@/lib/api'
import { TopupFlow } from '@/components/TopupFlow'
import { getLocale, getDateLocale } from '@/lib/i18n'
import { t } from '@/lib/t'
import type { PaymentProvider } from '@/lib/types'

// 'after' is the first arg so callers can use .bind(null, after) — Next.js 15 requires
// Server Actions passed to Client Components to be serializable (no plain closures).
async function createInvoice(after: string | undefined, provider: string, amount_usd: number, amount_rub?: number) {
  'use server'
  // Use the domain the user actually came from (x-real-host set by Bunny edge
  // script). Without this, imba.run users get redirected to imba.live after
  // payment and have to log in again.
  const hdrs = await headers()
  const host = hdrs.get('x-real-host') || hdrs.get('x-forwarded-host') || 'imba.live'
  const baseUrl = `https://${host}`
  const afterParam = after ? `&after=${after}` : ''
  const success_url = `${baseUrl}/dashboard/billing/topup/result?status=success&provider=${provider}${afterParam}`
  const fail_url = `${baseUrl}/dashboard/billing/topup/result?status=failed&provider=${provider}`
  const body = amount_rub !== undefined
    ? { provider, amount_rub, success_url, fail_url }
    : { provider, amount_usd, success_url, fail_url }
  try {
    const result = await apiFetch<{ payment_id: string; payment_url: string }>(
      '/v1/payments/invoice',
      { method: 'POST', body: JSON.stringify(body) },
    )
    return { payment_id: result.payment_id, payment_url: result.payment_url }
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Payment creation error')
  }
}

interface Props {
  searchParams: Promise<{ after?: string }>
}

export default async function TopupPage({ searchParams }: Props) {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const { after } = await searchParams

  const providers = await api.get<PaymentProvider[]>('/v1/payments/providers').catch(() => [])
  if (providers.length === 0) redirect('/dashboard/billing')

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const cur = user.currency ?? 'USD'

  const backHref = after ? `/dashboard/${after.split('_')[1] ?? 'billing'}` : '/dashboard/billing'

  return (
    <div className="fade-up max-w-lg space-y-6">
      <div>
        <a href={backHref} className="pill pill-paper pill-sm inline-flex mb-6">
          {t('topup.back', locale)}
        </a>
        <h1 className="display text-4xl mb-1">{t('topup.title', locale)}</h1>
        <p className="font-semibold text-ink/60">
          {after === 'activate_vpn' ? t('topup.vpn_auto', locale) : t('topup.instant', locale)}
        </p>
      </div>

      <TopupFlow
        providers={providers}
        currency={cur}
        rates={rates}
        createInvoice={createInvoice.bind(null, after) as (provider: string, amount_usd: number, amount_rub?: number) => Promise<{ payment_url: string; payment_id: string }>}
      />
    </div>
  )
}
