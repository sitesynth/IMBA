'use client'
import { useState } from 'react'
import { Loader2, Gift } from 'lucide-react'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'
import type { VpnTariff } from '@/lib/types'

function monthsLabel(n: number, locale: string): string {
  if (locale === 'ru') {
    const mod10 = n % 10
    const mod100 = n % 100
    if (n === 1) return 'месяц'
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'месяца'
    return 'месяцев'
  }
  return n === 1 ? 'month' : 'months'
}

export function VpnTariffGrid({
  tariffs,
  serverId,
  trialAvailable,
}: {
  tariffs: VpnTariff[]
  serverId: string
  trialAvailable: boolean
}) {
  const locale = useLocale()
  const [trialLoading, setTrialLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function buyTariff(tariff: VpnTariff) {
    const params = new URLSearchParams({
      after: `buy_vpn:${tariff.months}:${serverId}`,
      amount_usd: String(tariff.total_usd),
    })
    window.location.href = `/dashboard/billing/topup?${params}`
  }

  async function activateTrial() {
    setError(null)
    setTrialLoading(true)
    try {
      const res = await fetch('/api/action/vpn-trial', { method: 'POST', cache: 'no-store' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail ?? 'Activation error')
      }
      window.location.reload()
    } catch (e: unknown) {
      setError((e as Error).message || 'Activation error')
    } finally {
      setTrialLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        {tariffs.map((tariff) => {
          const highlighted = tariff.badge === 'best_value'
          const badgeLabel = tariff.badge === 'best_value'
            ? t('vpn.badge_best_value', locale)
            : tariff.badge === 'popular'
            ? t('vpn.badge_popular', locale)
            : null
          return (
            <button
              key={tariff.months}
              onClick={() => buyTariff(tariff)}
              className="relative text-left rounded-3xl border-2 border-ink p-5 transition-transform hover:-translate-y-0.5"
              style={{
                background: highlighted ? 'var(--green-100)' : tariff.badge === 'popular' ? 'var(--yellow-100)' : 'var(--paper)',
                boxShadow: highlighted ? '4px 4px 0 #111' : undefined,
              }}
            >
              {badgeLabel && (
                <span
                  className="absolute -top-3 left-4 chip text-[11px] py-1"
                  style={{ background: tariff.badge === 'best_value' ? 'var(--green)' : 'var(--yellow)' }}
                >
                  {badgeLabel}
                </span>
              )}
              <div className="text-sm font-extrabold text-ink/60 mb-2">
                {tariff.months} {monthsLabel(tariff.months, locale)}
              </div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="display text-3xl">${(tariff.total_usd / tariff.months).toFixed(2)}</span>
                <span className="text-sm font-bold text-ink/40">{t('vpn.per_month', locale)}</span>
              </div>
              <div className="text-xs font-semibold text-ink/50 mb-4">
                {t('vpn.total', locale)} ${tariff.total_usd.toFixed(2)}
              </div>
              <div className="pill pill-ink w-full justify-center text-sm">
                {t('vpn.select', locale)}
              </div>
            </button>
          )
        })}
      </div>

      {trialAvailable && (
        <button
          onClick={activateTrial}
          disabled={trialLoading}
          className="w-full flex items-center justify-between gap-4 rounded-3xl border-2 border-dashed border-ink/30 p-5 text-left transition-colors hover:border-ink disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 shrink-0" strokeWidth={2.5} />
            <div>
              <div className="font-extrabold text-sm">{t('vpn.trial_label', locale)}</div>
              <div className="text-xs font-semibold text-ink/50">{t('vpn.trial_sub', locale)}</div>
            </div>
          </div>
          <span className="pill pill-paper text-sm shrink-0">
            {trialLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('vpn.trial_btn', locale)}
          </span>
        </button>
      )}

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
    </div>
  )
}
