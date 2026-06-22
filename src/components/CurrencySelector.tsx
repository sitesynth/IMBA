'use client'
import { useState, useTransition } from 'react'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'Доллар' },
  { code: 'EUR', symbol: '€', label: 'Евро' },
  { code: 'RUB', symbol: '₽', label: 'Рубль' },
]

export function CurrencySelector({
  current,
  action,
}: {
  current: string
  action: (currency: string) => Promise<void>
}) {
  const [selected, setSelected] = useState(current || 'USD')
  const [pending, startTransition] = useTransition()

  function pick(code: string) {
    setSelected(code)
    startTransition(() => action(code))
  }

  return (
    <div className="flex gap-2">
      {CURRENCIES.map(({ code, symbol, label }) => (
        <button
          key={code}
          onClick={() => pick(code)}
          disabled={pending}
          className={`flex-1 rounded-2xl px-3 py-3 border-2 transition font-extrabold text-sm flex flex-col items-center gap-0.5 ${
            selected === code
              ? 'border-ink bg-ink text-paper'
              : 'border-cream bg-paper text-ink hover:border-ink/40'
          }`}
        >
          <span className="text-xl">{symbol}</span>
          <span className="text-xs font-bold opacity-70">{label}</span>
        </button>
      ))}
    </div>
  )
}
