'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'

type Provider = { name: string; display_name: string }

const PROVIDER_ICONS: Record<string, string> = {
  cryptobot: '🪙',
  stars: '⭐',
  yookassa: '💳',
}

const QUICK_AMOUNTS = [10, 25, 50, 100]

export function PaymentTopup({
  providers,
  createInvoice,
}: {
  providers: Provider[]
  createInvoice: (provider: string, amount: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const [selected, setSelected] = useState<string | null>(providers[0]?.name ?? null)
  const [amount, setAmount] = useState<number>(25)
  const [customAmount, setCustomAmount] = useState('')
  const [pending, startTransition] = useTransition()
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (providers.length === 0) return null

  const effectiveAmount = customAmount ? parseFloat(customAmount) : amount

  function handleQuick(a: number) {
    setAmount(a)
    setCustomAmount('')
    setPaymentUrl(null)
    setError(null)
  }

  function pay() {
    if (!selected || effectiveAmount <= 0) return
    setError(null)
    setPaymentUrl(null)
    startTransition(async () => {
      try {
        const result = await createInvoice(selected, effectiveAmount)
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
      {/* Provider selector */}
      {providers.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {providers.map((p) => (
            <button
              key={p.name}
              onClick={() => { setSelected(p.name); setPaymentUrl(null) }}
              className={`pill pill-sm transition ${
                selected === p.name ? 'pill-ink' : 'pill-paper'
              }`}
            >
              {PROVIDER_ICONS[p.name] ?? '💰'} {p.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Quick amounts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => handleQuick(a)}
            className={`pill pill-sm transition ${
              !customAmount && amount === a ? 'pill-ink' : 'pill-paper'
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex gap-2">
        <input
          type="number"
          step="1"
          min="1"
          max="10000"
          placeholder="Своя сумма USD"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setPaymentUrl(null) }}
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-sm"
        />
        <button
          onClick={pay}
          disabled={pending || !selected || effectiveAmount <= 0}
          className="pill pill-ink shrink-0"
        >
          {pending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>{PROVIDER_ICONS[selected ?? ''] ?? '💰'} Оплатить ${effectiveAmount}</>
          )}
        </button>
      </div>

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
