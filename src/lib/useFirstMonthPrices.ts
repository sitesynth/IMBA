'use client'
import { useEffect, useState } from 'react'
import type { FxRates, VpnTariff } from '@/lib/types'

export type FirstMonthPrices = { price: string; full: string; yearly: string; priceUsd: number }

type Offer = { price_rub: number; price_usd: number; full_price_rub: number; full_price_usd: number }

function fmt(currency: string, rub: number, usd: number, eur: number | undefined, rates: FxRates): string {
  const cur = currency?.toUpperCase() || 'USD'
  if (cur === 'RUB') return `${Math.round(rub)} ₽`
  if (cur === 'EUR') return `€${(eur ?? usd * rates.EUR).toFixed(2)}`
  return `$${usd.toFixed(2)}`
}

// Prices of the first-month offer in the user's own currency, taken from the API
// (offer + the longest tariff), so nothing about amounts or currency is hardcoded here.
export function useFirstMonthPrices(currency: string, rates: FxRates): FirstMonthPrices | null {
  const [data, setData] = useState<{ offer: Offer; yearly: VpnTariff | null } | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/v1/me/vpn/first-month-offer', { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/v1/me/vpn/tariffs', { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)),
    ]).then(([offer, tariffs]) => {
      if (cancelled || !offer) return
      const list = Array.isArray(tariffs) ? ([...tariffs] as VpnTariff[]).sort((a, b) => b.months - a.months) : []
      setData({ offer, yearly: list[0] ?? null })
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!data) return null
  const { offer, yearly } = data
  return {
    price: fmt(currency, offer.price_rub, offer.price_usd, undefined, rates),
    full: fmt(currency, offer.full_price_rub, offer.full_price_usd, undefined, rates),
    yearly: yearly ? fmt(currency, yearly.price_rub, yearly.price_usd, yearly.price_eur, rates) : '',
    priceUsd: offer.price_usd,
  }
}

export function fillPrices(text: string, p: FirstMonthPrices): string {
  return text.replace('{price}', p.price).replace('{full}', p.full).replace('{yearly}', p.yearly)
}
