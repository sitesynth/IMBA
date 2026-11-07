export interface ApiOrder {
  order_id: string
  kind: 'esim' | 'vpn'
  created_at: string
  charged_usd: number
  country?: string
  name?: string
  data_gb?: number
  months?: number
}

export type ApiState =
  | { enabled: false; balance_usd: number }
  | {
      enabled: true
      status: 'active' | 'suspended'
      key_prefix: string
      key_issued: boolean
      key_copyable: boolean
      balance_usd: number
      limits: { requests_per_minute: number; daily_spend_usd: number | null; spent_today_usd: number }
      orders: ApiOrder[]
    }

export interface ApiTopup {
  payment_id: string
  amount_usd: number
  status: string
  created_at: string | null
}

export interface ApiUsage {
  enabled: boolean
  days: number
  daily: { date: string; orders: number; esim: number; vpn: number; spent_usd: number }[]
  totals: { orders: number; esim: number; vpn: number; spent_usd: number }
  esim_countries: { country: string; orders: number; spent_usd: number }[]
  limits: { requests_per_minute: number | null; daily_spend_usd: number | null; spent_today_usd: number }
}

export interface ApiBilling {
  balance_usd: number
  totals: { topped_up_usd: number; credited_usd: number; spent_usd: number }
  entries: { date: string | null; kind: 'topup' | 'credit' | 'order'; title: string; amount_usd: number }[]
}

export const usd = (n: number) => `$${n.toFixed(2)}`

export function describeOrder(o: ApiOrder) {
  if (o.kind === 'vpn') return `VPN, ${o.months} ${o.months === 1 ? 'month' : 'months'}`
  return o.name || `eSIM ${o.country ?? ''} ${o.data_gb ?? ''} GB`.trim()
}
