'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, Loader2, Plus } from 'lucide-react'
import type { PaymentProvider } from '@/lib/types'

export function PaymentTopup({
  provider,
  createInvoice,
}: {
  provider: PaymentProvider
  createInvoice: (provider: string, amount: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const [amount, setAmount] = useState('')
  const [pending, startTransition] = useTransition()
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const numAmount = parseFloat(amount)
  const valid = !isNaN(numAmount) && numAmount >= provider.min_usd && numAmount <= provider.max_usd

  function pay(a: number) {
    setError(null)
    setPaymentUrl(null)
    startTransition(async () => {
      try {
        const result = await createInvoice(provider.name, a)
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
            $
          </span>
          <input
            type="number"
            step="1"
            min={provider.min_usd}
            max={provider.max_usd}
            placeholder={`${provider.min_usd} – ${provider.max_usd}`}
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setPaymentUrl(null) }}
            className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
          />
        </div>
        <button
          onClick={() => valid && pay(numAmount)}
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
        Лимиты: ${provider.min_usd} – ${provider.max_usd.toLocaleString('en')} · {provider.speed}
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
