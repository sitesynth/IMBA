import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Plus, Check } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { VpnTariffGrid } from '@/components/VpnTariffGrid'
import { formatMoney } from '@/lib/format'
import { getLocale, getDateLocale } from '@/lib/i18n'
import { t } from '@/lib/t'
import type { BillingInfo, PaymentProvider, PaymentRecord, VpnSubscription, VpnTariff } from '@/lib/types'

async function topup(formData: FormData) {
  'use server'
  const amount = Number(formData.get('amount'))
  if (!amount || amount <= 0) return
  try {
    await apiFetch('/v1/me/billing/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  } catch (e) {
    if (e instanceof ApiError) console.error('Topup failed:', e.message)
  }
  revalidatePath('/dashboard/billing')
  revalidatePath('/dashboard')
}

const QUICK_AMOUNTS_USD = [10, 25, 50, 100, 250]

export default async function BillingPage() {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const [billing, providers, history, vpns, tariffs] = await Promise.all([
    api.get<BillingInfo>('/v1/me/billing').catch(() => null as BillingInfo | null),
    api.get<PaymentProvider[]>('/v1/payments/providers').catch(() => []),
    api.get<PaymentRecord[]>('/v1/payments/history').catch(() => []),
    api.get<VpnSubscription[]>('/v1/me/vpn').catch(() => [] as VpnSubscription[]),
    api.get<VpnTariff[]>('/v1/me/vpn/tariffs').catch(() => [] as VpnTariff[]),
  ])

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const cur = user.currency ?? 'USD'
  const balanceUsd = billing?.balance ?? user.balance
  const activeVpn = vpns.find((v) => v.status === 'active')
  const defaultServerId = 'c973f18c-36df-4926-b369-05ebc0604579'
  const vpnServerId = activeVpn?.server_id ?? defaultServerId

  return (
    <div className="fade-up space-y-6">
      <div>
        <h1 className="display text-4xl md:text-5xl mb-1">{t('billing.title', locale)}</h1>
        <p className="font-semibold text-ink/60">{t('billing.subtitle', locale)}</p>
      </div>

      {/* Balance + plan */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="panel relative overflow-hidden" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <div className="text-xs font-extrabold uppercase tracking-widest opacity-60 mb-2">
            {t('billing.current_balance', locale)}
          </div>
          <div className="display text-5xl md:text-6xl mb-1" style={{ color: 'var(--yellow)' }}>
            {formatMoney(balanceUsd, cur, rates)}
          </div>
          {cur !== 'USD' && (
            <div className="text-xs font-semibold opacity-40 mb-1">
              ≈ ${balanceUsd.toFixed(2)} USD
            </div>
          )}
          <div className="text-sm font-semibold opacity-60 mb-5">{t('billing.balance_desc', locale)}</div>
          <LottieSticker
            name="rocket"
            size={72}
            className="hidden md:block"
            style={{ position: 'absolute', top: 18, right: 18 }}
          />
        </div>

        <div className="panel" style={{ background: 'var(--yellow-100)' }}>
          <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 mb-2">
            {t('billing.current_plan', locale)}
          </div>
          <div className="display text-3xl mb-1">
            {activeVpn ? 'VPN Про' : t('plan.start', locale)}
          </div>
          <div className="font-bold text-sm text-ink/60 mb-3">
            {activeVpn?.expires_at
              ? `${t('billing.active_until', locale)} ${new Date(activeVpn.expires_at).toLocaleDateString(getDateLocale(locale))}`
              : locale === 'ru' ? '7 дней пробный период' : '7-day trial'}
          </div>
        </div>
      </div>

      {/* Topup button */}
      {providers.length > 0 && (
        <a href="/dashboard/billing/topup" className="pill pill-ink inline-flex">
          <Plus className="w-4 h-4" strokeWidth={2.5} /> {t('billing.topup_balance', locale)}
        </a>
      )}

      {/* Demo topup — only show if no real providers */}
      {providers.length === 0 && (
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="display text-xl md:text-2xl">{t('billing.topup_balance', locale)}</h2>
            <span className="chip" style={{ background: 'var(--cream)' }}>Demo</span>
          </div>
          <p className="font-semibold text-ink/60 text-sm mb-5">
            {t('billing.demo_notice', locale)}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_AMOUNTS_USD.map((a) => (
              <form key={a} action={topup}>
                <input type="hidden" name="amount" value={a} />
                <button className="pill pill-paper pill-sm">
                  <Plus className="w-3 h-3" strokeWidth={3} /> {formatMoney(a, cur, rates)}
                </button>
              </form>
            ))}
          </div>
          <form action={topup} className="flex flex-col sm:flex-row gap-3">
            <input
              name="amount"
              type="number"
              step="0.01"
              min="1"
              max="10000"
              placeholder={t('billing.amount_placeholder', locale)}
              required
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
            />
            <button type="submit" className="pill pill-ink">
              <Plus className="w-4 h-4" strokeWidth={2.5} /> {t('dash.topup', locale)}
            </button>
          </form>
        </div>
      )}

      {/* VPN Pro — tariff grid */}
      {tariffs.length > 0 && (
        <div>
          <h2 className="display text-2xl md:text-3xl mb-1">
            {activeVpn
              ? (locale === 'ru' ? 'Продлить VPN Про' : 'Renew VPN Pro')
              : (locale === 'ru' ? 'Активировать VPN Про' : 'Activate VPN Pro')}
          </h2>
          <p className="font-semibold text-ink/60 mb-5 text-sm">
            {locale === 'ru'
              ? 'Оплата вперёд — 1, 3, 6 или 12 месяцев. Чем дольше, тем дешевле.'
              : 'Pay upfront — 1, 3, 6 or 12 months. Longer = cheaper per month.'}
          </p>
          {activeVpn && (
            <div className="panel mb-4" style={{ background: 'var(--blue-100)' }}>
              <div className="flex items-center gap-3">
                <span className="chip flex items-center gap-1" style={{ background: 'var(--green)' }}>
                  <Check className="w-3 h-3" strokeWidth={3} /> {t('dash.active', locale)}
                </span>
                <span className="font-semibold text-sm text-ink/70">
                  {locale === 'ru' ? 'до' : 'until'} {new Date(activeVpn.expires_at!).toLocaleDateString(getDateLocale(locale))}
                </span>
              </div>
            </div>
          )}
          <VpnTariffGrid
            tariffs={tariffs}
            serverId={vpnServerId}
            trialAvailable={false}
            balance={balanceUsd}
            activePlan={activeVpn?.plan ?? null}
            currency={cur}
            rates={rates}
          />
        </div>
      )}

      {/* Start trial */}
      {!activeVpn && !user.trial_activated && (
        <div className="panel" style={{ background: 'var(--paper)' }}>
          <div className="display text-xl mb-1">{t('plan.start', locale)}</div>
          <div className="font-bold text-sm text-ink/60 mb-3">
            {locale === 'ru' ? '7 дней бесплатно' : '7 days free'}
          </div>
          <ul className="space-y-2 font-semibold text-sm mb-5">
            {t('plan.start_features', locale).split('|').map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-ink mt-1.5 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <a href="/dashboard/vpn" className="pill pill-paper inline-flex">
            {locale === 'ru' ? 'Активировать пробный период →' : 'Activate free trial →'}
          </a>
        </div>
      )}

      {/* Payment history */}
      {history.length > 0 && (
        <div>
          <h2 className="display text-2xl md:text-3xl mb-1">{t('billing.history', locale)}</h2>
          <p className="font-semibold text-ink/60 mb-5 text-sm">{t('billing.history_desc', locale)}</p>
          <div className="panel p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-ink/10">
                    <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest text-ink/40">{t('billing.order', locale)}</th>
                    <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest text-ink/40">{t('billing.date', locale)}</th>
                    <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest text-ink/40">{t('billing.provider', locale)}</th>
                    <th className="text-right px-5 py-3 font-extrabold text-xs uppercase tracking-widest text-ink/40">{t('billing.amount', locale)}</th>
                    <th className="text-right px-5 py-3 font-extrabold text-xs uppercase tracking-widest text-ink/40">{t('billing.status', locale)}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((p) => {
                    const STATUS_LABEL: Record<string, string> = {
                      confirmed: t('billing.credited', locale),
                      pending: t('billing.pending', locale),
                      failed: t('billing.error', locale),
                      expired: t('dash.expired', locale),
                    }
                    const STATUS_COLOR: Record<string, string> = {
                      confirmed: 'var(--green)',
                      pending: 'var(--yellow)',
                      failed: 'var(--orange)',
                      expired: 'var(--cream)',
                    }
                    return (
                      <tr key={p.payment_id} className="border-b border-ink/5 last:border-0">
                        <td className="px-5 py-3 font-mono font-bold text-sm text-ink/70 whitespace-nowrap">
                          #{p.order_id}
                        </td>
                        <td className="px-5 py-3 font-semibold text-ink/60 whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString(getDateLocale(locale), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-5 py-3 font-bold capitalize">{p.provider}</td>
                        <td className="px-5 py-3 font-extrabold text-right">{formatMoney(p.amount, cur, rates)}</td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className="chip text-xs"
                            style={{ background: STATUS_COLOR[p.status] ?? 'var(--cream)' }}
                          >
                            {STATUS_LABEL[p.status] ?? p.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
