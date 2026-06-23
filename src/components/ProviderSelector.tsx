'use client'

import { useState } from 'react'
import { ArrowRight, Zap, CreditCard } from 'lucide-react'
import { PaymentTopup } from './PaymentTopup'
import type { PaymentProvider } from '@/lib/types'

const CARD_COLORS = [
  'var(--yellow-100)',
  'var(--violet-100)',
  'var(--cream)',
]

export function ProviderSelector({
  providers,
  createInvoice,
}: {
  providers: PaymentProvider[]
  createInvoice: (provider: string, amount: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const [selected, setSelected] = useState<string | null>(null)

  if (providers.length === 0) return null

  const selectedProvider = providers.find((p) => p.name === selected)

  return (
    <div className="space-y-6">
      {!selected ? (
        <>
          <div>
            <h2 className="display text-2xl md:text-3xl mb-1">Выберите способ оплаты</h2>
            <p className="font-semibold text-ink/60 text-sm">Мгновенное зачисление на баланс</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelected(p.name)}
                className="panel text-left transition hover:shadow-lg hover:scale-[1.02]"
                style={{ background: CARD_COLORS[i % CARD_COLORS.length] }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl leading-none">{p.icon}</div>
                  <h3 className="display text-lg">{p.display_name}</h3>
                </div>

                <p className="text-sm font-semibold text-ink/70 mb-4">{p.description}</p>

                <div className="mb-4 flex flex-wrap gap-1">
                  {p.methods.map((m) => (
                    <span
                      key={m}
                      className="inline-block px-2 py-1 rounded-lg text-xs font-bold bg-ink/10"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="space-y-1 mb-5 text-xs font-semibold text-ink/60">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 shrink-0" strokeWidth={3} />
                    {p.speed}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3 shrink-0" strokeWidth={3} />
                    ${p.min_usd} – ${p.max_usd.toLocaleString('en')}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  Выбрать
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(null)}
              className="pill pill-paper pill-sm shrink-0"
            >
              ← Назад
            </button>
            <div>
              <h2 className="display text-2xl">
                {selectedProvider?.icon} {selectedProvider?.display_name}
              </h2>
              <p className="text-sm font-semibold text-ink/60">
                {selectedProvider?.description}
              </p>
            </div>
          </div>

          {selectedProvider && (
            <PaymentTopup
              provider={selectedProvider}
              createInvoice={createInvoice}
            />
          )}
        </>
      )}
    </div>
  )
}
