export type UserProfile = {
  user_id: string
  email: string
  name: string | null
  balance: number
  plan_slug: string | null
  plan_name: string | null
  language: string
  currency: string
  rates: { EUR: number; RUB: number }
  created_at: string
}

export type Esim = {
  id: string
  country: string
  label: string | null
  iccid: string
  data_gb: number
  used_gb: number
  status: 'active' | 'expired' | 'pending'
  expires_at: string | null
  created_at: string
}

export type EsimCatalog = Record<
  string,
  { country: string; flag: string; prices: Record<string, number> }
>

export type VpnSubscription = {
  id: string
  plan: 'basic' | 'pro' | 'unlimited'
  server_id: string | null
  server_key: string | null
  status: 'active' | 'expired' | 'cancelled'
  expires_at: string | null
  created_at: string
}

export type VpnServer = {
  id: string
  city: string
  country: string
  flag: string
  host?: string
  port?: number
  ping?: number
}

export type VirtualCard = {
  id: string
  last4: string
  card_holder: string
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'expired'
  expiry_month: number
  expiry_year: number
  created_at: string
}

export type Transaction = {
  id: string
  amount: number
  currency: string
  merchant: string
  type: 'debit' | 'credit'
  status: 'completed' | 'pending' | 'failed'
  created_at: string
}

export type BillingInfo = {
  balance: number
  plan_slug: string | null
  plan_name: string | null
  plan_price: number | null
  subscription_status: string | null
  subscription_expires: string | null
}
