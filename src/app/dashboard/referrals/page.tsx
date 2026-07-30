'use client'
import { useEffect, useState } from 'react'
import { Copy, Check, Users, Gift, Clock, Ticket } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'
import { getDateLocale } from '@/lib/i18n-shared'

interface RewardCoupon {
  code: string
  days: number
  used: boolean
  created_at: string
}

interface ReferralStats {
  referral_code: string
  total_referrals: number
  completed_referrals: number
  pending_referrals: number
  total_earned: number
  reward_coupons?: RewardCoupon[]
}

export default function ReferralsPage() {
  const locale = useLocale()
  const [refCode, setRefCode] = useState<string | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.get<string>('/v1/promotions/referral/link').then(setRefCode).catch(() => null)
    api.get<ReferralStats>('/v1/promotions/referral/stats').then(setStats).catch(() => null)
  }, [])

  const baseDomain = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '') : 'imba.live'
  const refUrl = refCode ? `https://${baseDomain}/?ref=${refCode}` : ''

  function copyLink() {
    if (!refUrl) return
    navigator.clipboard.writeText(refUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-2xl md:text-3xl mb-1">{t('ref.title', locale)}</h1>
        <p className="text-sm font-semibold text-ink/55">
          {t('ref.desc', locale)}
        </p>
      </div>

      {/* Ref link card */}
      <div className="panel p-6 space-y-4" style={{ background: 'var(--paper)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Gift className="w-5 h-5" strokeWidth={2.5} />
          <span className="font-extrabold text-sm uppercase tracking-wide">{t('ref.your_link', locale)}</span>
        </div>

        {refCode ? (
          <div className="flex gap-2">
            <div
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink text-sm font-semibold truncate select-all"
              style={{ background: 'var(--cream)' }}
            >
              {refUrl}
            </div>
            <button
              onClick={copyLink}
              className="pill pill-ink flex-shrink-0 gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('ref.copied', locale) : t('ref.copy', locale)}
            </button>
          </div>
        ) : (
          <div className="h-12 rounded-2xl animate-pulse" style={{ background: 'var(--cream)' }} />
        )}

        <p className="text-xs font-semibold text-ink/45">
          {t('ref.flow', locale)}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, key: 'total', label: t('ref.total', locale), value: stats?.total_referrals ?? '—', bg: 'var(--paper)' },
          { icon: Check, key: 'paid', label: t('ref.paid', locale), value: stats?.completed_referrals ?? '—', bg: 'var(--yellow)' },
          { icon: Clock, key: 'pending', label: t('ref.pending_stat', locale), value: stats?.pending_referrals ?? '—', bg: 'var(--cream)' },
        ].map(({ icon: Icon, key, label, value, bg }) => (
          <div key={key} className="panel p-4 text-center" style={{ background: bg }}>
            <Icon className="w-5 h-5 mx-auto mb-2 text-ink/50" strokeWidth={2.5} />
            <div className="display text-2xl mb-0.5">{value}</div>
            <div className="text-xs font-semibold text-ink/55">{label}</div>
          </div>
        ))}
      </div>

      {/* 12 coupon slots */}
      <div className="panel p-6 space-y-4" style={{ background: 'var(--paper)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Ticket className="w-5 h-5" strokeWidth={2.5} />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            {locale === 'ru' ? 'Твой VPN на год!' : 'Your VPN for a year!'}
          </span>
        </div>
        <p className="text-xs font-semibold text-ink/45">
          {locale === 'ru'
            ? 'Приведи 12 друзей — получи 12 месяцев VPN бесплатно'
            : 'Refer 12 friends — get 12 months of VPN for free'}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const coupon = stats?.reward_coupons?.[i]
            if (coupon) {
              return (
                <div
                  key={coupon.code}
                  className={`relative rounded-2xl border-2 p-3 flex flex-col items-center justify-center text-center min-h-[90px] ${coupon.used ? 'border-ink/10 opacity-50' : 'border-ink'}`}
                  style={{ background: coupon.used ? 'var(--cream)' : 'var(--yellow)' }}
                >
                  <span className="text-[10px] font-semibold text-ink/40 mb-1">
                    {new Date(coupon.created_at).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                  </span>
                  <span className={`font-bold text-xs tracking-wide ${coupon.used ? 'line-through' : ''}`}>
                    {coupon.code}
                  </span>
                  <span className="text-[10px] font-semibold text-ink/50 mt-0.5">
                    {coupon.days} {locale === 'ru' ? 'дн. VPN' : 'days VPN'}
                  </span>
                  {coupon.used
                    ? <span className="text-[10px] font-bold text-ink/40 mt-1">{locale === 'ru' ? 'Использован' : 'Used'}</span>
                    : <CopyCouponButton code={coupon.code} locale={locale} />
                  }
                </div>
              )
            }
            return (
              <div
                key={`empty-${i}`}
                className="rounded-2xl border-2 border-dashed border-ink/15 p-3 flex flex-col items-center justify-center text-center min-h-[90px]"
                style={{ background: 'var(--cream)' }}
              >
                <span className="display text-lg text-ink/15">{i + 1}</span>
                <span className="text-[10px] font-semibold text-ink/25 mt-1">
                  {locale === 'ru' ? 'Приведи друга' : 'Refer a friend'}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs font-semibold text-ink/45">
          {locale === 'ru'
            ? 'Введите купон в разделе «Промокод» чтобы активировать VPN'
            : 'Enter the coupon in the Promo Code section to activate VPN'}
        </p>
      </div>

      {/* How it works */}
      <div className="panel p-6 space-y-4" style={{ background: 'var(--paper)' }}>
        <div className="font-extrabold text-sm uppercase tracking-wide mb-3">{t('ref.how_it_works', locale)}</div>
        {[
          { n: '1', text: t('ref.step1', locale) },
          { n: '2', text: t('ref.step2', locale) },
          { n: '3', text: t('ref.step3', locale) },
        ].map(({ n, text }) => (
          <div key={n} className="flex gap-4 items-start">
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black border-2 border-ink"
              style={{ background: 'var(--yellow)' }}
            >
              {n}
            </div>
            <p className="text-sm font-semibold text-ink/70 leading-relaxed pt-0.5">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CopyCouponButton({ code, locale }: { code: string; locale: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="pill pill-ink text-xs py-1 px-3 gap-1"
      onClick={() => {
        navigator.clipboard.writeText(code).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? (locale === 'ru' ? 'Скопировано' : 'Copied') : (locale === 'ru' ? 'Копировать' : 'Copy')}
    </button>
  )
}
