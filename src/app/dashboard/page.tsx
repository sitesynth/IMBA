import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const [esims, vpns, cards] = await Promise.all([
    prisma.esim.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.vpnSubscription.findMany({ where: { userId: user.id } }),
    prisma.virtualCard.findMany({
      where: { userId: user.id },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 4 } },
    }),
  ])

  const activeEsim = esims.find((e) => e.status === 'active')
  const activeVpn = vpns.find((v) => v.status === 'active')
  const card = cards[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'

  return (
    <div className="max-w-4xl fade-up">
      <div className="mb-8">
        <h1 className="display text-4xl mb-1">{greeting}, {user.name.split(' ')[0]} 👋</h1>
        <p className="font-semibold text-ink/60">Вот что происходит с твоими сервисами</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {/* eSIM */}
        <Link href="/dashboard/esim" className="panel group" style={{ background: 'var(--violet-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📶</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-ink/50 mb-1">eSIM</div>
          {activeEsim ? (
            <>
              <div className="display text-xl mb-3">{activeEsim.label}</div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>{activeEsim.usedGb} ГБ</span>
                <span className="text-ink/50">из {activeEsim.dataGb} ГБ</span>
              </div>
              <div className="h-2.5 bg-paper border-2 border-ink rounded-full overflow-hidden">
                <div className="h-full bg-ink" style={{ width: `${Math.min((activeEsim.usedGb / activeEsim.dataGb) * 100, 100)}%` }} />
              </div>
            </>
          ) : (
            <div className="font-semibold text-ink/50 text-sm">Нет активных eSIM</div>
          )}
        </Link>

        {/* VPN */}
        <Link href="/dashboard/vpn" className="panel group" style={{ background: 'var(--blue-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">🛡️</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-ink/50 mb-1">VPN</div>
          {activeVpn ? (
            <>
              <div className="display text-xl mb-3 capitalize">{activeVpn.plan}</div>
              <span className="chip bg-paper">● Активен</span>
            </>
          ) : (
            <div className="font-semibold text-ink/50 text-sm">Нет подписки</div>
          )}
        </Link>

        {/* Card */}
        <Link href="/dashboard/card" className="panel group" style={{ background: 'var(--green-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💳</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-ink/50 mb-1">Карта</div>
          {card ? (
            <>
              <div className="display text-xl mb-2">•••• {card.last4}</div>
              <div className="font-extrabold text-lg">${card.balance.toFixed(2)} <span className="text-xs text-ink/50">{card.currency}</span></div>
            </>
          ) : (
            <div className="font-semibold text-ink/50 text-sm">Нет карты</div>
          )}
        </Link>
      </div>

      {card && card.transactions.length > 0 && (
        <div className="panel">
          <div className="flex items-center justify-between mb-5">
            <h2 className="display text-xl">Последние операции</h2>
            <Link href="/dashboard/card" className="text-sm font-extrabold hover:opacity-60">Все →</Link>
          </div>
          <div className="space-y-1">
            {card.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b-2 border-cream last:border-0">
                <div>
                  <div className="font-extrabold text-sm">{tx.merchant}</div>
                  <div className="text-xs font-semibold text-ink/40">{new Date(tx.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
                <div className={`font-extrabold ${tx.type === 'credit' ? 'text-green-600' : ''}`}>
                  {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
