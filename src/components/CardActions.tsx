'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Snowflake, Sun, Plus, Copy, Check, Loader2 } from 'lucide-react'
import type { VirtualCard } from '@/lib/types'

interface Props {
  card: VirtualCard
  userBalance: number
}

type BuyState = 'idle' | 'loading' | 'ok' | 'error'

export function CardActions({ card, userBalance }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [topupOpen, setTopupOpen]   = useState(false)
  const [amount, setAmount]          = useState('')
  const [revealed, setRevealed]      = useState<{ number: string; cvv: string; expiry: string } | null>(null)
  const [copied, setCopied]          = useState<string | null>(null)
  const [error, setError]            = useState('')
  const [state, setState]            = useState<BuyState>('idle')

  const isFrozen = card.status === 'frozen'

  function copy(val: string, key: string) {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  async function apiCall(path: string, method = 'POST', body?: object) {
    const res = await fetch(`/api/v1/me/cards/${card.id}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.detail || `Ошибка ${res.status}`)
    }
    return res.json()
  }

  function handleTopup() {
    const n = parseFloat(amount)
    if (!n || n <= 0) { setError('Введи сумму'); return }
    if (n > userBalance) { setError(`Недостаточно средств (баланс $${userBalance.toFixed(2)})`); return }
    setError('')
    setState('loading')
    apiCall('/topup', 'POST', { amount: n })
      .then(() => {
        setState('ok')
        setAmount('')
        setTopupOpen(false)
        setTimeout(() => {
          setState('idle')
          startTransition(() => router.refresh())
        }, 1200)
      })
      .catch(e => { setState('error'); setError(e.message) })
  }

  function handleReveal() {
    if (revealed) { setRevealed(null); return }
    setState('loading')
    apiCall('/reveal', 'GET')
      .then(data => { setRevealed(data); setState('idle') })
      .catch(e => { setState('idle'); setError(e.message) })
  }

  function handleFreezeToggle() {
    setError('')
    setState('loading')
    const path = isFrozen ? '/unfreeze' : '/freeze'
    apiCall(path)
      .then(() => {
        setState('idle')
        startTransition(() => router.refresh())
      })
      .catch(e => { setState('idle'); setError(e.message) })
  }

  const busy = state === 'loading'

  return (
    <div className="space-y-3">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setTopupOpen(v => !v); setError('') }}
          disabled={busy || isFrozen}
          className="pill pill-ink pill-sm disabled:opacity-40"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Пополнить
        </button>

        <button
          onClick={handleReveal}
          disabled={busy || isFrozen}
          className="pill pill-paper pill-sm disabled:opacity-40"
        >
          {busy && !topupOpen
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : revealed
            ? <EyeOff className="w-4 h-4" strokeWidth={2.5} />
            : <Eye className="w-4 h-4" strokeWidth={2.5} />}
          {revealed ? 'Скрыть' : 'Реквизиты'}
        </button>

        <button
          onClick={handleFreezeToggle}
          disabled={busy}
          className="pill pill-paper pill-sm disabled:opacity-40"
        >
          {busy && !topupOpen && !revealed
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : isFrozen
            ? <Sun className="w-4 h-4" strokeWidth={2.5} />
            : <Snowflake className="w-4 h-4" strokeWidth={2.5} />}
          {isFrozen ? 'Разморозить' : 'Заморозить'}
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
              type="number" min="1" max="5000" step="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Сумма USD"
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm focus:outline-none"
            />
            <button
              onClick={handleTopup}
              disabled={busy}
              className="pill pill-ink disabled:opacity-50 min-w-[120px] justify-center"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Пополнить'}
            </button>
          </div>
          <p className="text-xs font-semibold text-ink/40 mt-2">
            Доступно на балансе: ${userBalance.toFixed(2)}
          </p>
        </div>
      )}

      {/* Revealed details */}
      {revealed && (
        <div className="panel" style={{ background: 'var(--violet-100)' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
            Реквизиты карты — никому не передавай
          </p>
          <div className="space-y-2">
            {[
              { label: 'Номер карты', value: revealed.number.replace(/(.{4})/g, '$1 ').trim(), key: 'number' },
              { label: 'CVV',         value: revealed.cvv,    key: 'cvv' },
              { label: 'Срок',        value: revealed.expiry, key: 'expiry' },
            ].map(({ label, value, key }) => (
              <div key={key} className="flex items-center justify-between bg-paper rounded-xl px-4 py-2.5 border-2 border-ink/10">
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

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  )
}
