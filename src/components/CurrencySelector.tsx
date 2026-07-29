'use client'
import { useState, useTransition } from 'react'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

function getCurrencies(locale: 'ru' | 'en') {
  return [
    { code: 'USD', symbol: '$', label: t('currency.usd', locale) },
    { code: 'EUR', symbol: '€', label: t('currency.eur', locale) },
    { code: 'RUB', symbol: '₽', label: t('currency.rub', locale) },
  ]
}

export function CurrencySelector({
  current,
  action,
}: {
  current: string
  action: (currency: string) => Promise<void>
}) {
  const locale = useLocale()
  const currencies = getCurrencies(locale)
  const [selected, setSelected] = useState(current || 'USD')
  const [pending, startTransition] = useTransition()

  function pick(code: string) {
    setSelected(code)
    startTransition(() => action(code))
  }

  return (
    <div className="flex gap-2">
      {currencies.map(({ code, symbol, label }) => (
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
