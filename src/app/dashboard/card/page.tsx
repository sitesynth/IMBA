import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Plus, Snowflake, Eye, CreditCard } from 'lucide-react'
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

function CardVisual({ card }: { card: VirtualCard }) {
  return (
    <div
      className="panel relative overflow-hidden flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
        color: '#fff',
        minHeight: 200,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="wordmark text-xl tracking-wider">IMBA</div>
        <div className="text-right text-xs font-bold opacity-80">
          <div>VISA</div>
          <div className="opacity-60">Mastercard</div>
        </div>
      </div>
      <div>
        <div className="display text-xl md:text-2xl mb-3 tracking-widest">
          •••• •••• •••• {card.last4}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Держатель</div>
            <div className="font-extrabold tracking-wider text-sm">{card.card_holder}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Баланс</div>
            <div className="font-extrabold text-sm">${card.balance.toFixed(2)} {card.currency}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Срок</div>
            <div className="font-extrabold tracking-wider text-sm">
              {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function CardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const cards = await api.get<VirtualCard[]>('/v1/me/cards').catch(() => [] as VirtualCard[])
  const cardSlots = (user as any).card_slots as number ?? 0
  const canIssueMore = cards.length < cardSlots || cardSlots === 0

  let txs: Transaction[] = []
  if (cards[0]) {
    txs = await api
      .get<Transaction[]>(`/v1/me/cards/${cards[0].id}/transactions`)
      .catch(() => [])
  }

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">Виртуальная карта</h1>
          <p className="font-semibold text-ink/60">Visa/Mastercard для зарубежных сервисов</p>
        </div>
        {cardSlots > 0 && (
          <span className="chip" style={{ background: 'var(--green-100)' }}>
            <CreditCard className="w-3.5 h-3.5 inline mr-1" strokeWidth={2.5} />
            {cards.length} / {cardSlots} карт
          </span>
        )}
      </div>

      {/* Existing cards */}
      {cards.length > 0 && (
        <div className="space-y-5">
          {cards.map((card) => (
            <div key={card.id} className="space-y-3">
              <div className="flex items-center justify-between">
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
                <div className="flex gap-2">
                  <button className="pill pill-paper pill-sm">
                    <Eye className="w-4 h-4" strokeWidth={2.5} /> CVV
                  </button>
                  <button className="pill pill-paper pill-sm">
                    <Snowflake className="w-4 h-4" strokeWidth={2.5} /> Заморозить
                  </button>
                </div>
              </div>
              <CardVisual card={card} />
            </div>
          ))}
        </div>
      )}

      {/* Issue new card form */}
      {canIssueMore && (
        <div className="panel" style={{ background: 'var(--green-100)' }}>
          {cards.length === 0 && (
            <div className="flex items-start gap-5 mb-5">
              <LottieSticker name="cards" size={88} />
              <div>
                <div className="display text-2xl md:text-3xl mb-2">Открой карту IMBA</div>
                <p className="font-semibold text-ink/70 text-sm mb-3">
                  Моментальный выпуск. Оплата Netflix, Spotify, ChatGPT, Adobe и любых зарубежных сервисов.
                </p>
                <ul className="space-y-1.5 font-bold text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ink" /> Visa / Mastercard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ink" /> USD / EUR / AED
                  </li>
                  {cardSlots === 0 && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-ink" /> Комиссия за выпуск $5
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {cards.length > 0 && (
            <div className="display text-xl mb-4">
              Выпустить ещё карту ({cards.length + 1} из {cardSlots})
            </div>
          )}

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
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Выпустить карту
            </button>
          </form>
        </div>
      )}

      {/* No slots on current plan */}
      {cards.length === 0 && cardSlots === 0 && !canIssueMore && (
        <div className="panel" style={{ background: 'var(--yellow-100)' }}>
          <p className="font-bold text-sm text-ink/70">
            На тарифе Старт карты недоступны. Перейди на Про — откроется 1 виртуальная карта.
          </p>
        </div>
      )}

      {/* Transactions of first card */}
      {txs.length > 0 && (
        <div className="panel">
          <div className="flex items-center justify-between mb-5">
            <h2 className="display text-xl md:text-2xl">Операции</h2>
            <span className="chip">{txs.length}</span>
          </div>
          <div className="space-y-1">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b-2 border-cream last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center text-sm"
                    style={{ background: tx.type === 'credit' ? 'var(--green-100)' : 'var(--paper)' }}
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
        </div>
      )}
    </div>
  )
}
