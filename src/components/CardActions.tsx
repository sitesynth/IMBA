'use client'

import { useState, useTransition } from 'react'
import { Eye, EyeOff, Snowflake, Sun, Plus, Copy, Check } from 'lucide-react'
import type { VirtualCard } from '@/lib/types'

interface Props {
  card: VirtualCard
  userBalance: number
  onTopup: (cardId: string, amount: number) => Promise<void>
  onFreeze: (cardId: string) => Promise<void>
  onUnfreeze: (cardId: string) => Promise<void>
  onReveal: (cardId: string) => Promise<{ number: string; cvv: string; expiry: string }>
}

export function CardActions({ card, userBalance, onTopup, onFreeze, onUnfreeze, onReveal }: Props) {
  const [pending, startTransition] = useTransition()
  const [topupOpen, setTopupOpen]   = useState(false)
  const [amount, setAmount]          = useState('')
  const [revealed, setRevealed]      = useState<{ number: string; cvv: string; expiry: string } | null>(null)
  const [copied, setCopied]          = useState<string | null>(null)
  const [error, setError]            = useState('')

  const isFrozen = card.status === 'frozen'

  function copy(val: string, key: string) {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleTopup() {
    const n = parseFloat(amount)
    if (!n || n <= 0) { setError('Введи сумму'); return }
    if (n > userBalance) { setError(`Недостаточно средств (баланс $${userBalance.toFixed(2)})`); return }
    setError('')
    startTransition(async () => {
      try {
        await onTopup(card.id, n)
        setAmount('')
        setTopupOpen(false)
      } catch (e) {
        setError((e as Error).message || 'Ошибка пополнения')
      }
    })
  }

  function handleReveal() {
    if (revealed) { setRevealed(null); return }
    startTransition(async () => {
      try {
        const data = await onReveal(card.id)
        setRevealed(data)
      } catch (e) {
        setError((e as Error).message || 'Ошибка')
      }
    })
  }

  function handleFreezeToggle() {
    setError('')
    startTransition(async () => {
      try {
        if (isFrozen) await onUnfreeze(card.id)
        else await onFreeze(card.id)
      } catch (e) {
        setError((e as Error).message || 'Ошибка')
      }
    })
  }

  return (
    <div className="space-y-3">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTopupOpen(v => !v)}
          disabled={pending || isFrozen}
          className="pill pill-ink pill-sm disabled:opacity-40"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Пополнить
        </button>

        <button
          onClick={handleReveal}
          disabled={pending || isFrozen}
          className="pill pill-paper pill-sm disabled:opacity-40"
        >
          {revealed
            ? <><EyeOff className="w-4 h-4" strokeWidth={2.5} /> Скрыть</>
            : <><Eye className="w-4 h-4" strokeWidth={2.5} /> Реквизиты</>}
        </button>

        <button
          onClick={handleFreezeToggle}
          disabled={pending}
          className="pill pill-paper pill-sm disabled:opacity-40"
        >
          {isFrozen
            ? <><Sun className="w-4 h-4" strokeWidth={2.5} /> Разморозить</>
            : <><Snowflake className="w-4 h-4" strokeWidth={2.5} /> Заморозить</>}
        </button>
      </div>

      {/* Topup panel */}
      {topupOpen && (
        <div className="panel" style={{ background: 'var(--green-100)' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
            Пополнение карты *{card.last4}
          </p>
          <div className="flex gap-2 flex-wrap">
            {[10, 25, 50, 100].map(v => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className={`pill pill-sm ${amount === String(v) ? 'pill-ink' : 'pill-paper'}`}
              >
                ${v}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="number"
              min="1"
              max="5000"
              step="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Сумма USD"
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm focus:outline-none"
            />
            <button
              onClick={handleTopup}
              disabled={pending}
              className="pill pill-ink disabled:opacity-50"
            >
              {pending ? '…' : 'Пополнить'}
            </button>
          </div>
          <p className="text-xs font-semibold text-ink/40 mt-2">
            Доступно на балансе: ${userBalance.toFixed(2)}
          </p>
        </div>
      )}

      {/* Revealed card details */}
      {revealed && (
        <div className="panel" style={{ background: 'var(--violet-100)' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
            Реквизиты карты — никому не передавай
          </p>
          <div className="space-y-2">
            {[
              { label: 'Номер карты', value: revealed.number.replace(/(.{4})/g, '$1 ').trim(), key: 'number' },
              { label: 'CVV',        value: revealed.cvv,    key: 'cvv' },
              { label: 'Срок',       value: revealed.expiry, key: 'expiry' },
            ].map(({ label, value, key }) => (
              <div
                key={key}
                className="flex items-center justify-between bg-paper rounded-xl px-4 py-2.5 border-2 border-ink/10"
              >
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-ink/40">{label}</div>
                  <div className="font-mono font-extrabold text-sm tracking-widest">{value}</div>
                </div>
                <button onClick={() => copy(value.replace(/\s/g, ''), key)} className="text-ink/30 hover:text-ink transition">
                  {copied === key
                    ? <Check className="w-4 h-4 text-green-500" strokeWidth={2.5} />
                    : <Copy className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-red-500">{error}</p>
      )}
    </div>
  )
}
