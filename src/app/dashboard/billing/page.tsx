import { FireIcon } from '@/components/FireIcon'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Plus, Check } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import type { BillingInfo } from '@/lib/types'

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

const PLANS = [
  {
    slug: 'start',
    name: 'Старт',
    price: 'Бесплатно',
    bg: 'var(--paper)',
    feats: ['1 eSIM профиль', 'VPN базовый', 'Без виртуальных карт'],
  },
  {
    slug: 'pro',
    name: 'Про',
    price: '$9.99/мес',
    bg: 'var(--yellow)',
    hot: true,
    feats: ['3 eSIM профиля', 'VPN Pro (50+ серверов)', '1 виртуальная карта', 'Приоритетная поддержка'],
  },
  {
    slug: 'business',
    name: 'Бизнес',
    price: '$24.99/мес',
    bg: 'var(--violet-100)',
    feats: ['10 eSIM профилей', 'VPN безлимит', '5 виртуальных карт', 'API доступ'],
  },
]

const QUICK_AMOUNTS = [10, 25, 50, 100, 250]

export default async function BillingPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const billing = await api
    .get<BillingInfo>('/v1/me/billing')
    .catch(() => null as BillingInfo | null)

  return (
    <div className="fade-up space-y-6">
      <div>
        <h1 className="display text-4xl md:text-5xl mb-1">Биллинг</h1>
        <p className="font-semibold text-ink/60">Баланс, план и платежи</p>
      </div>

      {/* Balance + plan */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="panel relative overflow-hidden" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <div className="text-xs font-extrabold uppercase tracking-widest opacity-60 mb-2">
            Текущий баланс
          </div>
          <div className="display text-5xl md:text-6xl mb-1" style={{ color: 'var(--yellow)' }}>
            ${(billing?.balance ?? user.balance).toFixed(2)}
          </div>
          <div className="text-sm font-semibold opacity-60 mb-5">Используется для покупок и подписок</div>
          <LottieSticker
            name="rocket"
            size={72}
            className="hidden md:block"
            style={{ position: 'absolute', top: 18, right: 18 }}
          />
        </div>

        <div className="panel" style={{ background: 'var(--yellow-100)' }}>
          <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 mb-2">
            Текущий план
          </div>
          <div className="display text-3xl mb-1">{billing?.plan_name || user.plan_name || 'Старт'}</div>
          <div className="font-bold text-sm text-ink/60 mb-3">
            {billing?.plan_price ? `$${billing.plan_price}/мес` : 'Бесплатно'}
          </div>
          {billing?.subscription_expires && billing.plan_price && billing.plan_price > 0 && (
            <div className="text-xs font-semibold text-ink/60">
              Активен до: {new Date(billing.subscription_expires).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>
      </div>

      {/* Quick topup */}
      <div className="panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="display text-xl md:text-2xl">Пополнить баланс</h2>
          <span className="chip" style={{ background: 'var(--cream)' }}>Demo</span>
        </div>
        <p className="font-semibold text-ink/60 text-sm mb-5">
          В demo-режиме пополнение мгновенное. Реальная оплата через крипту/перевод появится позже.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_AMOUNTS.map((a) => (
            <form key={a} action={topup}>
              <input type="hidden" name="amount" value={a} />
              <button className="pill pill-paper pill-sm">
                <Plus className="w-3 h-3" strokeWidth={3} /> ${a}
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
            placeholder="Сумма в USD"
            required
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
          />
          <button type="submit" className="pill pill-ink">
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Пополнить
          </button>
        </form>
      </div>

      {/* Plans */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">Тарифные планы</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">Плати только за то, что используешь</p>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((p) => {
            const isCurrent = (billing?.plan_slug || user.plan_slug) === p.slug
            return (
              <div key={p.slug} className="panel relative flex flex-col p-5 md:p-7" style={{ background: p.bg }}>
                {p.hot && (
                  <span
                    className="chip absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1"
                    style={{ background: 'var(--ink)', color: '#fff' }}
                  >
                    <FireIcon size={28} /> Популярный
                  </span>
                )}
                {isCurrent && (
                  <span
                    className="chip absolute -top-3.5 right-4"
                    style={{ background: 'var(--green)' }}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} /> Активен
                  </span>
                )}
                <div className="display text-xl mb-1">{p.name}</div>
                <div className="display text-lg md:text-2xl mb-5 whitespace-nowrap">{p.price}</div>
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
                      isCurrent ? 'pill-paper opacity-60 cursor-not-allowed' : p.hot ? 'pill-ink' : 'pill-paper'
                    }`}
                  >
                    {isCurrent ? 'Текущий план' : `Перейти на ${p.name}`}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
