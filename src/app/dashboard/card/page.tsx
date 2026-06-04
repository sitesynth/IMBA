import { redirect } from 'next/navigation'
import { ArrowUpRight, ArrowDownLeft, Plus, EyeOff } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function CardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const cards = await prisma.virtualCard.findMany({
    where: { userId: user.id },
    include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
  })
  const card = cards[0]

  return (
    <div className="max-w-3xl fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display text-4xl mb-1">Виртуальная карта</h1>
          <p className="font-semibold text-ink/60">Оплата зарубежных сервисов</p>
        </div>
      </div>

      {card ? (
        <>
          {/* Card visual */}
          <div className="rounded-[1.75rem] border-2 border-ink p-6 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2E7DF6 0%, #1452C9 100%)', minHeight: 210, boxShadow: '6px 6px 0 0 var(--ink)' }}>
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/imba-white.svg" alt="IMBA" style={{ height: 20, width: 'auto' }} />
                <div className="flex">
                  <span className="w-8 h-8 rounded-full bg-orange-500/90" />
                  <span className="w-8 h-8 rounded-full bg-yellow-400/90 -ml-3.5" />
                </div>
              </div>
              <div className="font-mono text-lg font-semibold mb-6" style={{ color: 'rgba(255,255,255,0.85)' }}>•••• •••• •••• {card.last4}</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Держатель</div>
                  <div className="font-extrabold text-sm" style={{ color: '#fff' }}>{card.cardHolder}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>До</div>
                  <div className="font-extrabold text-sm font-mono" style={{ color: '#fff' }}>{String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            <div className="panel" style={{ background: 'var(--green-100)' }}>
              <div className="text-xs font-extrabold uppercase text-ink/50 mb-1">Баланс</div>
              <div className="display text-3xl">${card.balance.toFixed(2)}</div>
              <div className="text-xs font-bold text-ink/40 mt-1">{card.currency}</div>
            </div>
            <div className="panel flex flex-col justify-between">
              <div className="text-xs font-extrabold uppercase text-ink/50 mb-2">Статус</div>
              <span className="chip bg-cream w-fit">{card.status === 'active' ? '● Активна' : card.status === 'frozen' ? '❄ Заморожена' : 'Истекла'}</span>
              <button className="text-xs font-bold text-ink/50 hover:text-ink mt-3 text-left underline underline-offset-2">
                {card.status === 'active' ? 'Заморозить карту' : 'Разморозить'}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button className="pill pill-ink flex-1 justify-center"><Plus className="w-4 h-4" strokeWidth={2.5} /> Пополнить</button>
            <button className="pill pill-paper flex-1 justify-center"><EyeOff className="w-4 h-4" strokeWidth={2.5} /> Показать CVV</button>
          </div>

          <div className="panel">
            <h3 className="display text-xl mb-5">Транзакции</h3>
            {card.transactions.length === 0 ? (
              <div className="text-center py-8 font-semibold text-ink/40">Транзакций пока нет</div>
            ) : (
              <div className="space-y-1">
                {card.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b-2 border-cream last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center" style={{ background: tx.type === 'credit' ? 'var(--green-100)' : 'var(--cream)' }}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" strokeWidth={2.5} /> : <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm">{tx.merchant}</div>
                        <div className="text-xs font-semibold text-ink/40">{new Date(tx.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</div>
                      </div>
                    </div>
                    <div className={`font-extrabold ${tx.type === 'credit' ? 'text-green-600' : ''}`}>
                      {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="panel text-center py-14">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="display text-xl mb-2">Нет виртуальной карты</h3>
          <p className="font-semibold text-ink/60 mb-6 max-w-xs mx-auto">Выпусти Visa/Mastercard для оплаты зарубежных сервисов</p>
          <button className="pill pill-ink mx-auto">Выпустить карту →</button>
        </div>
      )}
    </div>
  )
}
