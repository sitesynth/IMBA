'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, Loader2, ArrowRight, Zap } from 'lucide-react'
import { convertAmount } from '@/lib/format'
import type { PaymentProvider, FxRates } from '@/lib/types'

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', RUB: '₽' }
const CARD_COLORS = ['var(--yellow-100)', 'var(--violet-100)', 'var(--cream)']

export function PaymentFlow({
  providers,
  currency = 'USD',
  rates = { EUR: 0.92, RUB: 90 },
  createInvoice,
}: {
  providers: PaymentProvider[]
  currency?: string
  rates?: FxRates
  createInvoice: (provider: string, amount: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const [rawAmount, setRawAmount] = useState('')
  const [paying, setPaying] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const sym = CURRENCY_SYMBOL[currency] ?? currency
  const numAmount = parseFloat(rawAmount)

  // convert display amount → USD
  const rateToUsd = currency === 'USD' ? 1 : (rates as Record<string, number>)[currency] ?? 1
  const amountUsd = currency === 'USD' ? numAmount : numAmount / rateToUsd

  function pay(provider: PaymentProvider) {
    setError(null)
    setPaymentUrl(null)
    setPaying(provider.name)
    startTransition(async () => {
      try {
        const result = await createInvoice(provider.name, Math.round(amountUsd * 100) / 100)
        if (result.payment_url) {
          setPaymentUrl(result.payment_url)
          window.open(result.payment_url, '_blank')
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Ошибка создания платежа')
      } finally {
        setPaying(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">Пополнить баланс</h2>
        <p className="font-semibold text-ink/60 text-sm">Выберите сумму и способ оплаты</p>
      </div>

      {/* Step 1: Amount */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-2">
          Сумма
        </div>
        <div className="relative max-w-xs">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-ink/40 text-sm pointer-events-none">
            {sym}
          </span>
          <input
            type="number"
            step="1"
            min="1"
            placeholder="0"
            value={rawAmount}
            onChange={(e) => { setRawAmount(e.target.value); setPaymentUrl(null); setError(null) }}
            className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-ink bg-paper font-extrabold text-lg"
          />
        </div>
        {currency !== 'USD' && numAmount > 0 && (
          <p className="text-xs font-semibold text-ink/40 mt-1">≈ ${amountUsd.toFixed(2)} USD</p>
        )}
      </div>

      {/* Step 2: Providers — shown once amount entered */}
      {numAmount > 0 && (
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
            Способ оплаты
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {providers.map((p, i) => {
              const minDisplay = convertAmount(p.min_usd, currency, rates)
              const maxDisplay = convertAmount(p.max_usd, currency, rates)
              const disabled = amountUsd < p.min_usd || amountUsd > p.max_usd
              const isLoading = paying === p.name

              return (
                <button
                  key={p.name}
                  onClick={() => !disabled && pay(p)}
                  disabled={disabled || paying !== null}
                  className="panel text-left transition hover:shadow-md hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  style={{ background: disabled ? 'var(--paper)' : CARD_COLORS[i % CARD_COLORS.length] }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl leading-none">{p.icon}</span>
                    <div className="flex-1">
                      <div className="display text-base">{p.display_name}</div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-ink/50">
                        <Zap className="w-3 h-3" strokeWidth={3} />
                        {p.speed}
                      </div>
                    </div>
                    {isLoading
                      ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      : <ArrowRight className="w-4 h-4 shrink-0 text-ink/40" strokeWidth={2.5} />
                    }
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.methods.map((m) => (
                      <span key={m} className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold bg-ink/10">
                        {m}
                      </span>
                    ))}
                  </div>

                  {disabled && (
                    <p className="text-xs font-semibold text-ink/40 mt-2">
                      Лимит: {sym}{minDisplay} – {sym}{maxDisplay.toLocaleString()}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}

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
