import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { api } from '@/lib/api'
import { TopupFlow } from '@/components/TopupFlow'
import { getLocale } from '@/lib/i18n'
import { t } from '@/lib/t'
import type { PaymentProvider } from '@/lib/types'

interface Props {
  searchParams: Promise<{ after?: string; amount_usd?: string }>
}

export default async function TopupPage({ searchParams }: Props) {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const { after, amount_usd } = await searchParams

  const providers = await api.get<PaymentProvider[]>('/v1/payments/providers').catch(() => [])
  if (providers.length === 0) redirect('/dashboard/billing')

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const cur = user.currency ?? 'USD'

  // Pre-fill amount when coming from tariff grid
  let defaultAmount: string | undefined
  if (amount_usd) {
    const usd = parseFloat(amount_usd)
    if (!isNaN(usd)) {
      const { convertAmount } = await import('@/lib/format')
      defaultAmount = String(Math.round(convertAmount(usd, cur, rates) * 100) / 100)
    }
  }

  const backHref = after?.startsWith('buy_vpn:') ? '/dashboard/vpn' : after ? `/dashboard/${after.split('_')[1] ?? 'billing'}` : '/dashboard/billing'

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
        defaultAmount={defaultAmount}
        after={after}
      />
    </div>
  )
}
