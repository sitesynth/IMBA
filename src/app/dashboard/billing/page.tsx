import { FireIcon } from '@/components/FireIcon'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Plus, Check } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { formatMoney } from '@/lib/format'
import { getLocale, getDateLocale } from '@/lib/i18n'
import { t } from '@/lib/t'
import type { BillingInfo, PaymentProvider, PaymentRecord } from '@/lib/types'

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

async function upgradePlan(formData: FormData) {
  'use server'
  const plan_slug = formData.get('plan_slug') as string
  try {
    await apiFetch('/v1/me/plan/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan_slug }),
    })
  } catch (e) {
    if (e instanceof ApiError) console.error('Plan upgrade failed:', e.message)
  }
  revalidatePath('/dashboard/billing')
  revalidatePath('/dashboard')
}

function getPLANS(locale: 'ru' | 'en') {
  return [
    {
      slug: 'start',
      name: t('plan.start', locale),
      priceUsd: 0,
      bg: 'var(--paper)',
      feats: t('plan.start_features', locale).split('|'),
    },
    {
      slug: 'pro',
      name: 'IMBA COMBO',
      priceUsd: 9.99,
      bg: 'var(--yellow)',
      hot: true,
      feats: t('plan.pro_features', locale).split('|'),
    },
  ]
}

const QUICK_AMOUNTS_USD = [10, 25, 50, 100, 250]


export default async function BillingPage() {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const PLANS = getPLANS(locale)

  const [billing, providers, history] = await Promise.all([
    api.get<BillingInfo>('/v1/me/billing').catch(() => null as BillingInfo | null),
    api.get<PaymentProvider[]>('/v1/payments/providers').catch(() => []),
    api.get<PaymentRecord[]>('/v1/payments/history').catch(() => []),
  ])

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const cur = user.currency ?? 'USD'
  const balanceUsd = billing?.balance ?? user.balance

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
          <div className="display text-3xl mb-1">{billing?.plan_name || user.plan_name || t('plan.start', locale)}</div>
          <div className="font-bold text-sm text-ink/60 mb-3">
            {billing?.plan_price
              ? `${formatMoney(billing.plan_price, cur, rates)}/мес`
              : t('billing.free', locale)}
          </div>
          {billing?.subscription_expires && billing.plan_price && billing.plan_price > 0 && (
            <div className="text-xs font-semibold text-ink/60">
              {t('billing.active_until', locale)} {new Date(billing.subscription_expires).toLocaleDateString(getDateLocale(locale))}
            </div>
          )}
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

      {/* COMBO hero */}
      {(() => {
        const combo = PLANS.find(p => p.slug === 'pro')!
        const isCurrent = (billing?.plan_slug || user.plan_slug) === 'pro'
        const priceLabel = `${formatMoney(combo.priceUsd, cur, rates)}/мес`
        return (
          <div>
            <h2 className="display text-2xl md:text-3xl mb-1">IMBA COMBO</h2>
            <p className="font-semibold text-ink/60 mb-5 text-sm">{t('billing.combo_desc', locale)}</p>
            <div className="panel relative flex flex-col md:flex-row gap-6 p-6 md:p-8" style={{ background: 'var(--yellow)' }}>
              <div className="flex-1">
                {isCurrent && (
                  <span className="chip flex items-center gap-1 w-fit mb-3" style={{ background: 'var(--green)' }}>
                    <Check className="w-3 h-3" strokeWidth={3} /> {t('dash.active', locale)}
                  </span>
                )}
                <div className="display text-4xl md:text-5xl mb-1">{priceLabel}</div>
                <p className="font-semibold text-ink/60 text-sm mb-5">{t('billing.monthly', locale)}</p>
                <ul className="space-y-2.5 font-semibold text-sm">
                  {combo.feats.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" strokeWidth={3} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex md:flex-col justify-end gap-3">
                <form action={upgradePlan}>
                  <input type="hidden" name="plan_slug" value="pro" />
                  <button
                    type="submit"
                    disabled={isCurrent}
                    className={`pill whitespace-nowrap ${isCurrent ? 'pill-paper opacity-60 cursor-not-allowed' : 'pill-ink'}`}
                  >
                    {isCurrent ? t('billing.connected', locale) : t('billing.connect_combo', locale)}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Individual plans */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">{t('billing.other_plans', locale)}</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">{t('billing.other_plans_desc', locale)}</p>
        <div className="grid md:grid-cols-2 gap-5">
          {PLANS.filter(p => p.slug !== 'pro').map((p) => {
            const isCurrent = (billing?.plan_slug || user.plan_slug) === p.slug
            const priceLabel = p.priceUsd === 0
              ? t('billing.free', locale)
              : `${formatMoney(p.priceUsd, cur, rates)}/мес`
            return (
              <div key={p.slug} className="panel relative flex flex-col p-5 md:p-7" style={{ background: p.bg }}>
                {isCurrent && (
                  <div className="flex justify-center mb-3">
                    <span className="chip flex items-center gap-1" style={{ background: 'var(--green)' }}>
                      <Check className="w-3 h-3" strokeWidth={3} /> {t('dash.active', locale)}
                    </span>
                  </div>
                )}
                <div className="display text-xl mb-1">{p.name}</div>
                <div className="display text-lg md:text-2xl mb-5 whitespace-nowrap">{priceLabel}</div>
                <ul className="space-y-2 font-semibold text-sm mb-6 flex-1">
                  {p.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-ink mt-1.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <form action={upgradePlan}>
                  <input type="hidden" name="plan_slug" value={p.slug} />
                  <button
                    type="submit"
                    disabled={isCurrent}
                    className={`pill w-full justify-center ${
                      isCurrent ? 'pill-paper opacity-60 cursor-not-allowed' : 'pill-paper'
                    }`}
                  >
                    {isCurrent ? t('billing.current', locale) : `${locale === 'ru' ? 'Перейти на' : 'Switch to'} ${p.name}`}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment history */}
      {history.length > 0 && (
        <div>
          <h2 className="display text-2xl md:text-3xl mb-1">{t('billing.history', locale)}</h2>
          <p className="font-semibold text-ink/60 mb-5 text-sm">{t('billing.history_desc', locale)}</p>
          <div className="panel p-0 overflow-hidden">
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
      )}
    </div>
  )
}
