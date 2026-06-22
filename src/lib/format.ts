export type FxRates = { EUR: number; RUB: number }

const SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', RUB: '₽' }

export function formatMoney(
  usd: number,
  currency: string,
  rates: FxRates,
): string {
  const cur = currency?.toUpperCase() || 'USD'
  if (cur === 'EUR') {
    return `€${(usd * rates.EUR).toFixed(2)}`
  }
  if (cur === 'RUB') {
    return `${Math.round(usd * rates.RUB)} ₽`
  }
  return `$${usd.toFixed(2)}`
}

export function currencySymbol(currency: string): string {
  return SYMBOLS[currency?.toUpperCase()] ?? '$'
}

export function convertAmount(usd: number, currency: string, rates: FxRates): number {
  const cur = currency?.toUpperCase() || 'USD'
  if (cur === 'EUR') return usd * rates.EUR
  if (cur === 'RUB') return usd * rates.RUB
  return usd
}
