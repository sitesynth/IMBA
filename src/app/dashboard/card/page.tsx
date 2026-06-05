import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Plus, Snowflake, Eye } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import type { VirtualCard, Transaction } from '@/lib/types'

async function issueCard(formData: FormData) {
  'use server'
  const card_holder = (formData.get('card_holder') as string) || 'IMBA USER'
  const currency = (formData.get('currency') as string) || 'USD'
  try {
    await apiFetch('/v1/me/cards', {
      method: 'POST',
      body: JSON.stringify({ card_holder, currency }),
    })
  } catch (e) {
    if (e instanceof ApiError) console.error('Card issue failed:', e.message)
  }
  revalidatePath('/dashboard/card')
  revalidatePath('/dashboard')
}

export default async function CardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const cards = await api.get<VirtualCard[]>('/v1/me/cards').catch(() => [] as VirtualCard[])
  const card = cards[0]

  let txs: Transaction[] = []
  if (card) {
    txs = await api
      .get<Transaction[]>(`/v1/me/cards/${card.id}/transactions`)
      .catch(() => [])
  }

  if (!card) {
    return (
      <div className="fade-up space-y-6">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">Виртуальная карта</h1>
          <p className="font-semibold text-ink/60">Visa/Mastercard для зарубежных сервисов</p>
        </div>

        <div className="panel" style={{ background: 'var(--green-100)' }}>
          <div className="flex items-start gap-5 mb-5">
            <LottieSticker name="cards" size={96} />
            <div>
              <div className="display text-2xl md:text-3xl mb-2">Открой карту IMBA</div>
              <p className="font-semibold text-ink/70 text-sm mb-3">
                Моментальный выпуск, оплата Netflix, Spotify, ChatGPT, Adobe и любых других зарубежных
                сервисов.
              </p>
              <ul className="space-y-1.5 font-bold text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ink" /> Visa / Mastercard
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ink" /> USD / EUR / AED
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ink" /> Комиссия за выпуск $5
                </li>
              </ul>
            </div>
          </div>

          <form action={issueCard} className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                name="card_holder"
                placeholder="Имя на карте (латиницей)"
                defaultValue={(user.name || 'IMBA USER').toUpperCase()}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
              />
              <select
                name="currency"
                className="px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AED">AED</option>
              </select>
            </div>
            <button type="submit" className="pill pill-ink">
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Выпустить карту за $5
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">Карта IMBA</h1>
          <p className="font-semibold text-ink/60">Управляй балансом и операциями</p>
        </div>
        <span
          className="chip"
          style={{
            background:
              card.status === 'active'
                ? 'var(--green)'
                : card.status === 'frozen'
                ? 'var(--blue-100)'
                : 'var(--orange)',
          }}
        >
          {card.status === 'active' ? '● Активна' : card.status === 'frozen' ? '❄ Заморожена' : 'Истекла'}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Card visual */}
        <div
          className="panel relative overflow-hidden flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-deep) 100%)',
            color: 'var(--paper)',
            minHeight: 240,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="wordmark text-2xl tracking-wider">IMBA</div>
            <div className="text-right text-xs font-bold opacity-80">
              <div>VISA</div>
              <div>Mastercard</div>
            </div>
          </div>

          <div>
            <div className="display text-2xl md:text-3xl mb-3 tracking-widest">
              •••• •••• •••• {card.last4}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase opacity-60 tracking-widest">
                  Держатель
                </div>
                <div className="font-extrabold tracking-wider text-sm">{card.card_holder}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase opacity-60 tracking-widest">
                  Срок
                </div>
                <div className="font-extrabold tracking-wider text-sm">
                  {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance + actions */}
        <div className="panel" style={{ background: 'var(--green-100)' }}>
          <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 mb-2">
            Баланс карты
          </div>
          <div className="display text-5xl mb-1">${card.balance.toFixed(2)}</div>
          <div className="text-sm font-bold text-ink/60 mb-5">{card.currency}</div>

          <div className="flex flex-wrap gap-2">
            <button className="pill pill-ink pill-sm">
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Пополнить
            </button>
            <button className="pill pill-paper pill-sm">
              <Eye className="w-4 h-4" strokeWidth={2.5} /> Показать CVV
            </button>
            <button className="pill pill-paper pill-sm">
              <Snowflake className="w-4 h-4" strokeWidth={2.5} /> Заморозить
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="panel">
        <div className="flex items-center justify-between mb-5">
          <h2 className="display text-xl md:text-2xl">Операции</h2>
          <span className="chip">{txs.length}</span>
        </div>
        {txs.length === 0 ? (
          <p className="font-semibold text-ink/50 text-sm py-4">
            Пока нет операций. Сделай первую покупку — она появится здесь.
          </p>
        ) : (
          <div className="space-y-1">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b-2 border-cream last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center text-sm"
                    style={{
                      background: tx.type === 'credit' ? 'var(--green-100)' : 'var(--paper)',
                    }}
                  >
                    {tx.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">{tx.merchant}</div>
                    <div className="text-xs font-semibold text-ink/40">
                      {new Date(tx.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className={`font-extrabold ${tx.type === 'credit' ? 'text-green-600' : ''}`}>
                  {tx.type === 'credit' ? '+' : '−'}
                  {Math.abs(tx.amount).toFixed(2)} {tx.currency}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
