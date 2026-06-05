import Link from 'next/link'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowRight, Wallet, Plus } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api } from '@/lib/api'
import type { Esim, VpnSubscription, VirtualCard, Transaction } from '@/lib/types'

const LottieSticker = dynamic(() => import('@/components/LottieSticker').then(m => ({ default: m.LottieSticker })), {
  ssr: false,
  loading: () => <div style={{ width: 88, height: 88 }} />,
})

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  // Ensure user has required fields
  const safeUser = {
    ...user,
    balance: typeof user.balance === 'number' ? user.balance : 0,
    plan_name: user.plan_name || 'План IMBA',
  }

  const [esims, vpns, cards] = await Promise.all([
    api.get<Esim[]>('/v1/me/esims').catch(() => [] as Esim[]),
    api.get<VpnSubscription[]>('/v1/me/vpn').catch(() => [] as VpnSubscription[]),
    api.get<VirtualCard[]>('/v1/me/cards').catch(() => [] as VirtualCard[]),
  ])

  const activeEsim = esims.find((e) => e.status === 'active')
  const activeVpn = vpns.find((v) => v.status === 'active')
  const card = cards[0]

  let recentTx: Transaction[] = []
  if (card) {
    recentTx = await api
      .get<Transaction[]>(`/v1/me/cards/${card.id}/transactions`)
      .catch(() => [])
    recentTx = recentTx.slice(0, 5)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'
  const firstName = (safeUser.name || safeUser.email.split('@')[0]).split(' ')[0]

  return (
    <div className="fade-up space-y-6">
      {/* Greeting */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">{greeting}, {firstName} 👋</h1>
          <p className="font-semibold text-ink/60">Вот что происходит с твоими сервисами</p>
        </div>
        <Link href="/dashboard/billing" className="pill pill-ink pill-sm">
          <Wallet className="w-4 h-4" strokeWidth={2.5} /> ${safeUser.balance.toFixed(2)}
        </Link>
      </div>

      {/* Hero — balance card */}
      <div
        className="panel relative overflow-hidden"
        style={{ background: 'var(--ink)', color: 'var(--paper)' }}
      >
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest opacity-60 mb-2">
              {safeUser.plan_name}
            </div>
            <div className="display text-5xl md:text-6xl mb-1" style={{ color: 'var(--yellow)' }}>
              ${safeUser.balance.toFixed(2)}
            </div>
            <div className="text-sm font-semibold opacity-60">Доступный баланс</div>
          </div>
          <LottieSticker name="rocket" size={88} className="hidden md:block" />
        </div>
        <div className="flex flex-wrap gap-2 mt-5 relative z-10">
          <Link href="/dashboard/billing" className="pill pill-yellow pill-sm">
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Пополнить
          </Link>
          <Link href="/dashboard/billing" className="pill pill-paper pill-sm">
            Сменить план →
          </Link>
        </div>
      </div>

      {/* 3 service cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* eSIM */}
        <Link href="/dashboard/esim" className="panel group" style={{ background: 'var(--violet-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="chip bg-paper">eSIM</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          {activeEsim ? (
            <>
              <div className="display text-2xl mb-1">{activeEsim.label || activeEsim.country}</div>
              <div className="text-xs font-bold text-ink/60 mb-3">{activeEsim.country}</div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>{activeEsim.used_gb.toFixed(1)} ГБ</span>
                <span className="text-ink/50">из {activeEsim.data_gb} ГБ</span>
              </div>
              <div className="h-2.5 bg-paper border-2 border-ink rounded-full overflow-hidden">
                <div
                  className="h-full bg-ink"
                  style={{ width: `${Math.min((activeEsim.used_gb / activeEsim.data_gb) * 100, 100)}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="display text-xl mb-2">Купить eSIM</div>
              <p className="text-xs font-semibold text-ink/60">190+ стран, активация по QR</p>
            </>
          )}
        </Link>

        {/* VPN */}
        <Link href="/dashboard/vpn" className="panel group" style={{ background: 'var(--blue-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="chip bg-paper">VPN</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          {activeVpn ? (
            <>
              <div className="display text-2xl mb-2 capitalize">{activeVpn.plan}</div>
              <span className="chip bg-paper">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Активен
              </span>
            </>
          ) : (
            <>
              <div className="display text-xl mb-2">Включить VPN</div>
              <p className="text-xs font-semibold text-ink/60">WireGuard, 50+ серверов, без логов</p>
            </>
          )}
        </Link>

        {/* Card */}
        <Link href="/dashboard/card" className="panel group" style={{ background: 'var(--green-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="chip bg-paper">Карта</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          {card ? (
            <>
              <div className="display text-2xl mb-1">•••• {card.last4}</div>
              <div className="font-extrabold text-lg">
                ${card.balance.toFixed(2)}{' '}
                <span className="text-xs text-ink/50 font-bold">{card.currency}</span>
              </div>
            </>
          ) : (
            <>
              <div className="display text-xl mb-2">Выпустить карту</div>
              <p className="text-xs font-semibold text-ink/60">Visa/Mastercard, USD · EUR · AED</p>
            </>
          )}
        </Link>
      </div>

      {/* Recent transactions */}
      {recentTx.length > 0 && card && (
        <div className="panel">
          <div className="flex items-center justify-between mb-5">
            <h2 className="display text-xl md:text-2xl">Последние операции</h2>
            <Link href="/dashboard/card" className="text-sm font-extrabold hover:opacity-60">
              Все →
            </Link>
          </div>
          <div className="space-y-1">
            {recentTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b-2 border-cream last:border-0"
              >
                <div>
                  <div className="font-extrabold text-sm">{tx.merchant}</div>
                  <div className="text-xs font-semibold text-ink/40">
                    {new Date(tx.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className={`font-extrabold ${tx.type === 'credit' ? 'text-green-600' : ''}`}>
                  {tx.type === 'credit' ? '+' : '−'}
                  {Math.abs(tx.amount).toFixed(2)} {tx.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
