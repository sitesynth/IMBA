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

const MirIcon = () => (
  <svg viewBox="0 0 400 120" width="56" height="17" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mirGrdRu" x1="370" x2="290" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1F5CD7"/>
        <stop stopColor="#02AEFF" offset="1"/>
      </linearGradient>
    </defs>
    <path d="m31 13h33c3 0 12-1 16 13 3 9 7 23 13 44h2c6-22 11-37 13-44 4-14 14-13 18-13h31v96h-32v-57h-2l-17 57h-24l-17-57h-3v57h-31m139-96h32v57h3l21-47c4-9 13-10 13-10h30v96h-32v-57h-2l-21 47c-4 9-14 10-14 10h-30m142-29v29h-30v-50h98c-4 12-18 21-34 21" fill="#0f754e"/>
    <path d="m382 53c4-18-8-40-34-40h-68c2 21 20 40 39 40" fill="url(#mirGrdRu)"/>
  </svg>
)

const SbpIcon = () => (
  <svg viewBox="0 0 97 120" width="20" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 26.12l14.532 25.975v15.844L.017 93.863 0 26.12z" fill="#5B57A2"/>
    <path d="M55.797 42.643l13.617-8.346 27.868-.026-41.485 25.414V42.643z" fill="#D90751"/>
    <path d="M55.72 25.967l.077 34.39-14.566-8.95V0l14.49 25.967z" fill="#FAB718"/>
    <path d="M97.282 34.271l-27.869.026-13.693-8.33L41.231 0l56.05 34.271z" fill="#ED6F26"/>
    <path d="M55.797 94.007V77.322l-14.566-8.78.008 51.458 14.558-25.993z" fill="#63B22F"/>
    <path d="M69.38 85.737L14.531 52.095 0 26.12l97.223 59.583-27.844.034z" fill="#1487C9"/>
    <path d="M41.24 120l14.556-25.993 13.583-8.27 27.843-.034L41.24 120z" fill="#017F36"/>
    <path d="M.017 93.863l41.333-25.32-13.896-8.526-12.922 7.922L.017 93.863z" fill="#984995"/>
  </svg>
)

const UsdtBody = () => (
  <>
    <path d="M137.378 237.452L45.111 433.146 296.633 676.509 546.892 433.146 453.361 237.452z" fill="#45b68d"/>
    <path d="M417.694 300.174H174.031v58.384h92.419v85.813h58.825v-85.813h92.419z" fill="#ffffff"/>
    <path d="m296.611 453.918c-76.452 0-138.434-12.009-138.434-26.825 0-14.813 61.979-26.824 138.434-26.824 76.451 0 138.431 12.011 138.431 26.824 0 14.816-61.98 26.825-138.431 26.825zm155.438-22.353c0-19.103-69.592-34.588-155.438-34.588-85.845 0-155.441 15.485-155.441 34.588 0 16.823 53.964 30.84 125.472 33.945v123.188h58.82V465.559c72.059-3.009 126.587-17.084 126.587-33.994z" fill="#ffffff"/>
  </>
)

const UsdtTrc20Icon = () => (
  <svg viewBox="30 225 540 455" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <UsdtBody />
    <circle cx="454.5" cy="547.5" r="109.5" fill="#ff060a" stroke="#ffffff" strokeWidth="8"/>
    <path d="m524.833 528.336c-6.594-6.088-15.715-15.385-23.144-21.979l-.44-.308c-.731-.587-1.556-1.048-2.439-1.362-17.913-3.341-101.28-18.924-102.907-18.727-.456.064-.891.229-1.275.484l-.417.33c-.514.522-.905 1.153-1.143 1.846l-.11.286v1.802c9.385 26.133 46.442 111.742 53.739 131.831.44 1.363 1.275 3.956 2.835 4.088h.352c.835 0 4.396-4.704 4.396-4.704s63.652-77.19 70.091-85.411c.834-1.012 1.57-2.101 2.198-3.252.161-.901.085-1.828-.219-2.691-.304-.863-.827-1.632-1.517-2.233zm-54.223 8.99l27.167-22.529 15.935 14.682zm-10.55-1.473l-46.771-38.332 75.674 13.957zm4.22 10.045l47.871-7.715-54.728 65.937zm-57.343-44.552l49.211 41.76-7.121 61.058z" fill="#ffffff"/>
  </svg>
)

const UsdtErc20Icon = () => (
  <svg viewBox="30 225 540 455" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <UsdtBody />
    <circle cx="454.5" cy="547.5" r="109.5" fill="#627EEA" stroke="#ffffff" strokeWidth="8"/>
    <polygon points="454.5,455 404,545 454.5,572 505,545" fill="rgba(255,255,255,0.75)"/>
    <polygon points="454.5,455 404,545 454.5,518 505,545" fill="#ffffff"/>
    <polygon points="454.5,640 404,560 454.5,572 505,560" fill="#ffffff"/>
    <polygon points="454.5,640 404,560 454.5,614 505,560" fill="rgba(255,255,255,0.75)"/>
  </svg>
)

const FK_METHODS = [
  { id: 36,  label: 'Карта РФ',   icon: <MirIcon />,        min_usd: 0 },
  { id: 42,  label: 'СБП',        icon: <SbpIcon />,        min_usd: 0 },
  { id: 15,  label: 'USDT TRC20', icon: <UsdtTrc20Icon />,  min_usd: 2.5 },
  { id: 14,  label: 'USDT ERC20', icon: <UsdtErc20Icon />,  min_usd: 10 },
]

export function TopupFlow({
  providers,
  currency = 'USD',
  rates = { EUR: 0.92, RUB: 90 },
  createInvoice,
}: {
  providers: PaymentProvider[]
  currency?: string
  rates?: FxRates
  createInvoice: (provider: string, amount_usd: number, amount_rub?: number, payment_system_id?: number) => Promise<{ payment_url: string; payment_id: string }>
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

  function pay(provider: PaymentProvider, paymentSystemId?: number) {
    setError(null)
    setPaymentUrl(null)
    const key = paymentSystemId ? `${provider.name}_${paymentSystemId}` : provider.name
    setPaying(key)
    startTransition(async () => {
      try {
        const amountRub = currency === 'RUB' ? numAmount : undefined
        const result = await createInvoice(provider.name, Math.round(amountUsd * 100) / 100, amountRub, paymentSystemId)
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
              const cardBg = outOfRange ? 'var(--paper)' : CARD_COLORS[i % CARD_COLORS.length]

              if (p.name === 'freekassa') {
                return (
                  <div
                    key={p.name}
                    className="panel"
                    style={{ background: cardBg, opacity: outOfRange ? 0.4 : 1 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-4xl leading-none">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="display text-xl">{p.display_name}</div>
                        <div className="text-sm font-semibold text-ink/60">Карта РФ, СБП, USDT TRC20, USDT ERC20</div>
                        {outOfRange && (
                          <p className="text-xs font-semibold text-ink/40 mt-1">
                            Лимит: {sym}{minDisplay} – {sym}{maxDisplay.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-ink/50 shrink-0">
                        <Zap className="w-3 h-3" strokeWidth={3} />
                        Мгновенно
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {FK_METHODS.map((m) => {
                        const key = `${p.name}_${m.id}`
                        const isLoading = paying === key
                        const belowMin = m.min_usd > 0 && amountUsd < m.min_usd
                        const btnDisabled = outOfRange || belowMin || paying !== null
                        return (
                          <button
                            key={m.id}
                            onClick={() => !btnDisabled && pay(p, m.id)}
                            disabled={btnDisabled}
                            title={belowMin ? `Мин $${m.min_usd}` : undefined}
                            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 border-ink font-extrabold text-sm transition-all duration-150 active:scale-95 hover:scale-[1.03] hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                            style={{ background: 'var(--paper)' }}
                          >
                            <span className="h-7 flex items-center justify-center">
                              {isLoading
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : m.icon
                              }
                            </span>
                            <span className="text-xs leading-tight text-center">{m.label}</span>
                            {belowMin && <span className="text-[9px] leading-tight text-center opacity-50">мин ${m.min_usd}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              }

              const isLoading = paying === p.name
              return (
                <button
                  key={p.name}
                  onClick={() => !outOfRange && pay(p)}
                  disabled={outOfRange || paying !== null}
                  className="panel w-full text-left transition hover:shadow-md hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  style={{ background: cardBg }}
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
