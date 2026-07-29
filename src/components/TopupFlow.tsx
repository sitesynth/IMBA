'use client'

import { useState, useTransition } from 'react'
import { ArrowRight, Zap, Loader2, ExternalLink, Delete } from 'lucide-react'
import { convertAmount } from '@/lib/format'
import type { PaymentProvider, FxRates } from '@/lib/types'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', RUB: '₽' }
const CARD_COLORS = ['var(--yellow-100)', 'var(--violet-100)', 'var(--cream)']
const PAD = ['1','2','3','4','5','6','7','8','9','→','0','⌫']

export function TopupFlow({
  providers,
  currency = 'USD',
  rates = { EUR: 0.92, RUB: 90 },
  createInvoice,
}: {
  providers: PaymentProvider[]
  currency?: string
  rates?: FxRates
  createInvoice: (provider: string, amount_usd: number, amount_rub?: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const locale = useLocale()
  const [rawAmount, setRawAmount] = useState('')
  const [paying, setPaying] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const sym = CURRENCY_SYMBOL[currency] ?? currency
  const numAmount = parseFloat(rawAmount)
  const hasAmount = !isNaN(numAmount) && numAmount > 0
  const rateToUsd = currency === 'USD' ? 1 : (rates as Record<string, number>)[currency] ?? 1
  const amountUsd = currency === 'USD' ? numAmount : numAmount / rateToUsd

  function handlePad(key: string) {
    setPaymentUrl(null)
    setError(null)
    if (key === '⌫') { setRawAmount(prev => prev.slice(0, -1)); return }
    if (key === '→') { document.getElementById('pay-methods')?.scrollIntoView({ behavior: 'smooth' }); return }
    setRawAmount(prev => {
      const next = prev + key
      if (next.length > 7) return prev
      if (next.length > 1 && next.startsWith('0')) return prev
      return next
    })
  }

  function pay(provider: PaymentProvider) {
    setError(null)
    setPaymentUrl(null)
    setPaying(provider.name)
    startTransition(async () => {
      try {
        const amountRub = currency === 'RUB' ? numAmount : undefined
        const result = await createInvoice(provider.name, Math.round(amountUsd * 100) / 100, amountRub)
        if (result.payment_url) {
          setPaymentUrl(result.payment_url)
          window.open(result.payment_url, '_blank')
        }
      } catch (e: unknown) {
        setError((e as Error).message || t('topup.error', locale))
      } finally {
        setPaying(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Desktop: regular input */}
      <div className="hidden md:block">
        <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-2">
          {t('topup.amount_label', locale)}
        </div>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-extrabold text-ink/40 text-2xl pointer-events-none">{sym}</span>
          <input
            type="number"
            step="1"
            min="1"
            placeholder="0"
            value={rawAmount}
            onChange={(e) => { setRawAmount(e.target.value); setPaymentUrl(null); setError(null) }}
            className="w-full pl-12 pr-5 py-5 rounded-3xl border-2 border-ink bg-paper font-extrabold text-3xl"
          />
        </div>
      </div>

      {/* Mobile: amount display + presets + numpad */}
      <div className="md:hidden space-y-4">
        <div
          className="rounded-3xl border-2 border-ink flex items-center justify-center py-6"
          style={{ background: 'var(--paper)', minHeight: 88 }}
        >
          <span className="font-extrabold text-ink/30 text-3xl mr-1">{sym}</span>
          <span className="font-extrabold text-4xl" style={{ minWidth: 60, textAlign: 'center' }}>
            {rawAmount || <span className="text-ink/20">0</span>}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PAD.map((key, i) => (
            <button
              key={i}
              onClick={() => handlePad(key)}
              disabled={!key}
              className="rounded-2xl py-4 text-xl font-extrabold border-2 border-ink transition active:scale-95 disabled:border-transparent disabled:cursor-default flex items-center justify-center"
              style={{ background: key === '→' ? 'var(--ink)' : key === '⌫' ? 'var(--paper)' : 'var(--cream)', color: key === '→' ? 'var(--paper)' : undefined }}
            >
              {key === '⌫' ? <Delete className="w-5 h-5" strokeWidth={2.5} /> : key}
            </button>
          ))}
        </div>
      </div>

      {/* Providers — shown after amount entered */}
      {hasAmount && (
        <div id="pay-methods" className="fade-up">
          <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
            {t('topup.method', locale)}
          </div>
          <div className="space-y-3">
            {providers.map((p, i) => {
              const minDisplay = convertAmount(p.min_usd, currency, rates)
              const maxDisplay = convertAmount(p.max_usd, currency, rates)
              const outOfRange = amountUsd < p.min_usd || amountUsd > p.max_usd
              const isLoading = paying === p.name

              return (
                <button
                  key={p.name}
                  onClick={() => !outOfRange && pay(p)}
                  disabled={outOfRange || paying !== null}
                  className="panel w-full text-left transition hover:shadow-md hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  style={{ background: outOfRange ? 'var(--paper)' : CARD_COLORS[i % CARD_COLORS.length] }}
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
                      {outOfRange && (
                        <p className="text-xs font-semibold text-ink/40 mt-2">
                          {t('topup.limit', locale)} {sym}{minDisplay} – {sym}{maxDisplay.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1 text-xs font-semibold text-ink/50">
                        <Zap className="w-3 h-3" strokeWidth={3} />
                        {p.speed}
                      </div>
                      {isLoading
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <ArrowRight className="w-5 h-5 text-ink/40" strokeWidth={2} />
                      }
                    </div>
                  </div>
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
          {t('topup.open_payment', locale)}
        </a>
      )}
    </div>
  )
}
