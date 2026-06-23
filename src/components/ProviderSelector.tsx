'use client'

import { useState } from 'react'
import { ArrowRight, Zap, Coins, CreditCard } from 'lucide-react'
import { PaymentTopup } from './PaymentTopup'

type Provider = { name: string; display_name: string }

const PROVIDER_DETAILS: Record<string, {
  icon: string
  description: string
  methods: string[]
  speed: string
  minMax: string
  color: string
}> = {
  cryptobot: {
    icon: '🪙',
    description: 'Платёж криптовалютой через Telegram',
    methods: ['USDT', 'TON', 'BTC', 'ETH'],
    speed: 'Мгновенно',
    minMax: '$1 – $1,000',
    color: 'var(--yellow-100)',
  },
  stars: {
    icon: '⭐',
    description: 'Telegram Stars — встроенная валюта',
    methods: ['Telegram Stars'],
    speed: 'Мгновенно',
    minMax: 'Зависит от лимита',
    color: 'var(--blue-100)',
  },
  yookassa: {
    icon: '💳',
    description: 'Карты РФ, СБП, рекуррентные платежи',
    methods: ['Карта РФ', 'СБП', 'Рекурринг'],
    speed: '1–2 минуты',
    minMax: '$1 – $10,000',
    color: 'var(--violet-100)',
  },
}

export function ProviderSelector({
  providers,
  createInvoice,
}: {
  providers: Provider[]
  createInvoice: (provider: string, amount: number) => Promise<{ payment_url: string; payment_id: string }>
}) {
  const [selected, setSelected] = useState<string | null>(null)

  if (providers.length === 0) return null

  return (
    <div className="space-y-6">
      {!selected ? (
        <>
          <div>
            <h2 className="display text-2xl md:text-3xl mb-1">Выберите способ оплаты</h2>
            <p className="font-semibold text-ink/60 text-sm">Мгновенное зачисление на баланс</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => {
              const details = PROVIDER_DETAILS[p.name]
              if (!details) return null
              return (
                <button
                  key={p.name}
                  onClick={() => setSelected(p.name)}
                  className="panel text-left transition hover:shadow-lg hover:scale-105"
                  style={{ background: details.color }}
                >
                  {/* Provider icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{details.icon}</div>
                    <div>
                      <h3 className="display text-lg font-bold">{p.display_name}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-semibold text-ink/70 mb-4">{details.description}</p>

                  {/* Methods */}
                  <div className="mb-4 flex flex-wrap gap-1">
                    {details.methods.map((m) => (
                      <span
                        key={m}
                        className="inline-block px-2 py-1 rounded-lg text-xs font-bold bg-ink/10"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Speed & limits */}
                  <div className="space-y-1 mb-4 text-xs font-semibold text-ink/60">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3" strokeWidth={3} />
                      {details.speed}
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3 h-3" strokeWidth={3} />
                      {details.minMax}
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="flex items-center gap-2 text-sm font-bold text-ink hover:gap-3 transition">
                    Выбрать
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(null)}
              className="pill pill-paper pill-sm"
            >
              ← Назад
            </button>
            <div>
              <h2 className="display text-2xl">
                {PROVIDER_DETAILS[selected]?.icon} Пополнить баланс
              </h2>
              <p className="text-sm font-semibold text-ink/60">
                {PROVIDER_DETAILS[selected]?.description}
              </p>
            </div>
          </div>

          <PaymentTopup
            providers={providers.filter((p) => p.name === selected)}
            createInvoice={createInvoice}
          />
        </>
      )}
    </div>
  )
}
