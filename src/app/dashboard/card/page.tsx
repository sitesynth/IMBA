import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Plus, CreditCard } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { CardActions } from '@/components/CardActions'
import type { VirtualCard, Transaction } from '@/lib/types'

// ── Server actions ────────────────────────────────────────────────────────────

async function issueCard(formData: FormData) {
  'use server'
  const card_holder = (formData.get('card_holder') as string) || 'IMBA USER'
  const currency    = (formData.get('currency') as string) || 'USD'
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

async function topupCard(cardId: string, amount: number) {
  'use server'
  await apiFetch(`/v1/me/cards/${cardId}/topup`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })
  revalidatePath('/dashboard/card')
  revalidatePath('/dashboard')
}

async function freezeCard(cardId: string) {
  'use server'
  await apiFetch(`/v1/me/cards/${cardId}/freeze`, { method: 'POST' })
  revalidatePath('/dashboard/card')
}

async function unfreezeCard(cardId: string) {
  'use server'
  await apiFetch(`/v1/me/cards/${cardId}/unfreeze`, { method: 'POST' })
  revalidatePath('/dashboard/card')
}

async function revealCard(cardId: string) {
  'use server'
  return apiFetch<{ number: string; cvv: string; expiry: string }>(
    `/v1/me/cards/${cardId}/reveal`
  )
}

// ── Card visual (server component) ───────────────────────────────────────────

function CardVisual({ card }: { card: VirtualCard }) {
  const isFrozen = card.status === 'frozen'
  return (
    <div
      className="panel relative overflow-hidden flex flex-col justify-between select-none"
      style={{
        background: isFrozen
          ? 'linear-gradient(135deg, #64748b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
        color: '#fff',
        minHeight: 200,
        transition: 'background 0.4s',
      }}
    >
      {/* Watermark circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 bg-white" />
      <div className="absolute -right-4 -bottom-10 w-56 h-56 rounded-full opacity-5 bg-white" />

      <div className="relative flex items-start justify-between">
        <div className="wordmark text-xl tracking-wider">IMBA</div>
        <div className="text-right text-xs font-bold opacity-80 space-y-0.5">
          <div>VISA</div>
        </div>
      </div>

      <div className="relative">
        <div className="display text-xl md:text-2xl mb-3 tracking-widest font-mono">
          •••• •••• •••• {card.last4}
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Держатель</div>
            <div className="font-extrabold tracking-wider text-sm">{card.card_holder}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Баланс</div>
            <div className="font-extrabold text-sm">${card.balance.toFixed(2)} {card.currency}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Срок</div>
            <div className="font-extrabold tracking-wider text-sm font-mono">
              {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const cards     = await api.get<VirtualCard[]>('/v1/me/cards').catch(() => [] as VirtualCard[])
  const cardSlots = Math.max((user as any).card_slots as number ?? 0, 1)
  const canIssueMore = cards.filter(c => c.status !== 'expired').length < cardSlots

  const txs: Transaction[] = cards[0]
    ? await api.get<Transaction[]>(`/v1/me/cards/${cards[0].id}/transactions`).catch(() => [])
    : []

  return (
    <div className="fade-up space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">Виртуальная карта</h1>
          <p className="font-semibold text-ink/60">Visa для оплаты зарубежных сервисов</p>
        </div>
        {cards.length > 0 && (
          <span className="chip" style={{ background: 'var(--green-100)' }}>
            <CreditCard className="w-3.5 h-3.5 inline mr-1" strokeWidth={2.5} />
            {cards.filter(c => c.status === 'active').length} активных
          </span>
        )}
      </div>

      {/* Existing cards */}
      {cards.map((card) => (
        <div key={card.id} className="space-y-3">
          {/* Status chip */}
          <div className="flex items-center gap-2">
            <span
              className="chip text-xs"
              style={{
                background: card.status === 'active'
                  ? 'var(--green)'
                  : card.status === 'frozen'
                  ? 'var(--blue-100)'
                  : 'var(--orange)',
              }}
            >
              {card.status === 'active'
                ? '● Активна'
                : card.status === 'frozen'
                ? '❄ Заморожена'
                : 'Истекла'}
            </span>
          </div>

          <CardVisual card={card} />

          <CardActions
            card={card}
            userBalance={(user as any).balance ?? 0}
            onTopup={topupCard}
            onFreeze={freezeCard}
            onUnfreeze={unfreezeCard}
            onReveal={revealCard}
          />
        </div>
      ))}

      {/* Issue new card */}
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
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ink" /> Visa / Mastercard</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ink" /> USD / EUR / AED</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ink" /> Выпуск бесплатно</li>
                </ul>
              </div>
            </div>
          )}

          {cards.length > 0 && (
            <div className="display text-xl mb-4">Ещё одна карта</div>
          )}

          <form action={issueCard} className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                name="card_holder"
                placeholder="Имя на карте (латиницей)"
                defaultValue={((user as any).name || 'IMBA USER').toUpperCase()}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm focus:outline-none"
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
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Выпустить карту бесплатно
            </button>
          </form>
        </div>
      )}

      {/* Transactions */}
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
                    className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center text-sm font-bold"
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
