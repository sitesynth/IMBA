'use client'

import { useState, useTransition } from 'react'
import { ArrowRight, Zap, Loader2, ExternalLink } from 'lucide-react'
import { convertAmount } from '@/lib/format'
import type { PaymentProvider, FxRates } from '@/lib/types'

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', RUB: '₽' }
const CARD_COLORS = ['var(--yellow-100)', 'var(--violet-100)', 'var(--cream)']

export function TopupFlow({
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
  const [step, setStep] = useState<'provider' | 'amount'>('provider')
  const [selected, setSelected] = useState<PaymentProvider | null>(null)
  const [rawAmount, setRawAmount] = useState('')
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [paying, setPaying] = useState(false)

  const sym = CURRENCY_SYMBOL[currency] ?? currency
  const numAmount = parseFloat(rawAmount)
  const rateToUsd = currency === 'USD' ? 1 : (rates as Record<string, number>)[currency] ?? 1
  const amountUsd = currency === 'USD' ? numAmount : numAmount / rateToUsd
  const minDisplay = selected ? convertAmount(selected.min_usd, currency, rates) : 0
  const maxDisplay = selected ? convertAmount(selected.max_usd, currency, rates) : 0
  const valid = selected !== null && numAmount >= minDisplay && numAmount <= maxDisplay

  function selectProvider(p: PaymentProvider) {
    setSelected(p)
    setStep('amount')
    setRawAmount('')
    setPaymentUrl(null)
    setError(null)
  }

  function pay() {
    if (!valid || !selected) return
    setError(null)
    setPaymentUrl(null)
    setPaying(true)
    startTransition(async () => {
      try {
        const result = await createInvoice(selected.name, Math.round(amountUsd * 100) / 100)
        if (result.payment_url) {
          setPaymentUrl(result.payment_url)
          window.open(result.payment_url, '_blank')
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Ошибка создания платежа')
      } finally {
        setPaying(false)
      }
    })
  }

  if (step === 'provider') {
    return (
      <div className="space-y-3">
        {providers.map((p, i) => (
          <button
            key={p.name}
            onClick={() => selectProvider(p)}
            className="panel w-full text-left transition hover:shadow-md hover:scale-[1.01]"
            style={{ background: CARD_COLORS[i % CARD_COLORS.length] }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl leading-none">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="display text-xl">{p.display_name}</div>
                <div className="text-sm font-semibold text-ink/60">{p.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.methods.map((m) => (
                    <span key={m} className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold bg-ink/10">{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1 text-xs font-semibold text-ink/50">
                  <Zap className="w-3 h-3" strokeWidth={3} />
                  {p.speed}
                </div>
                <ArrowRight className="w-5 h-5 text-ink/40" strokeWidth={2} />
              </div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button onClick={() => setStep('provider')} className="pill pill-paper pill-sm">
        ← {selected?.display_name}
      </button>

      <div
        className="panel flex items-center gap-4"
        style={{ background: CARD_COLORS[providers.indexOf(selected!) % CARD_COLORS.length] }}
      >
        <span className="text-3xl leading-none">{selected?.icon}</span>
        <div>
          <div className="display text-xl">{selected?.display_name}</div>
          <div className="text-sm font-semibold text-ink/60">{selected?.description}</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-2">Сумма</div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-ink/40 pointer-events-none">
            {sym}
          </span>
          <input
            type="number"
            step="1"
            min={minDisplay}
            max={maxDisplay}
            placeholder={`${minDisplay} – ${maxDisplay}`}
            value={rawAmount}
            autoFocus
            onChange={(e) => { setRawAmount(e.target.value); setPaymentUrl(null); setError(null) }}
            className="w-full pl-8 pr-4 py-4 rounded-2xl border-2 border-ink bg-paper font-extrabold text-xl"
          />
        </div>
        {currency !== 'USD' && numAmount > 0 && (
          <p className="text-xs font-semibold text-ink/40 mt-1">≈ ${amountUsd.toFixed(2)} USD</p>
        )}
        <p className="text-xs font-semibold text-ink/40 mt-1">
          Лимиты: {sym}{minDisplay} – {sym}{maxDisplay.toLocaleString()}
        </p>
      </div>

      <button
        onClick={pay}
        disabled={paying || !valid}
        className="pill pill-ink w-full justify-center"
      >
        {paying
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : `Оплатить ${valid ? `${sym}${rawAmount}` : ''}`
        }
      </button>

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
