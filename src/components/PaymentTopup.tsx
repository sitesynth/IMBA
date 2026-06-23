'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, Loader2, Plus } from 'lucide-react'
import { formatMoney, convertAmount } from '@/lib/format'
import type { PaymentProvider, FxRates } from '@/lib/types'

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', RUB: '₽' }

export function PaymentTopup({
  provider,
  currency = 'USD',
  rates = { EUR: 0.92, RUB: 90 },
  createInvoice,
}: {
  provider: PaymentProvider
  currency?: string
  rates?: FxRates
  createInvoice: (provider: string, amount: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const [amount, setAmount] = useState('')
  const [pending, startTransition] = useTransition()
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sym = CURRENCY_SYMBOL[currency] ?? currency
  // limits in user currency
  const minDisplay = convertAmount(provider.min_usd, currency, rates)
  const maxDisplay = convertAmount(provider.max_usd, currency, rates)
  const numAmount = parseFloat(amount)
  const valid = !isNaN(numAmount) && numAmount >= minDisplay && numAmount <= maxDisplay

  // convert user-entered amount back to USD for the API
  const rateToUsd = currency === 'USD' ? 1 : (rates as Record<string, number>)[currency] ?? 1
  const amountUsd = currency === 'USD' ? numAmount : numAmount / rateToUsd

  function pay() {
    if (!valid) return
    setError(null)
    setPaymentUrl(null)
    startTransition(async () => {
      try {
        const result = await createInvoice(provider.name, Math.round(amountUsd * 100) / 100)
        if (result.payment_url) {
          setPaymentUrl(result.payment_url)
          window.open(result.payment_url, '_blank')
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Ошибка создания платежа')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-ink/40 text-sm pointer-events-none">
            {sym}
          </span>
          <input
            type="number"
            step="1"
            min={minDisplay}
            max={maxDisplay}
            placeholder={`${minDisplay} – ${maxDisplay}`}
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setPaymentUrl(null) }}
            className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
          />
        </div>
        <button
          onClick={pay}
          disabled={pending || !valid}
          className="pill pill-ink shrink-0"
        >
          {pending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Пополнить
            </>
          )}
        </button>
      </div>

      <p className="text-xs font-semibold text-ink/40">
        Лимиты: {sym}{minDisplay} – {sym}{maxDisplay.toLocaleString()} · {provider.speed}
        {currency !== 'USD' && valid && (
          <> · ≈ ${amountUsd.toFixed(2)} USD</>
        )}
      </p>

      {error && (
        <p className="text-sm font-bold text-red-600">{error}</p>
      )}

      {paymentUrl && (
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill-paper w-full justify-center"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
          Открыть страницу оплаты
        </a>
      )}
    </div>
  )
}
