const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.imba.live'
const TOKEN_KEY = "imba_admin"

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function adminReq<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new AdminApiError(res.status, body.detail ?? body.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export interface Stats {
  users_total: number
  users_new_30d: number
  revenue_30d: number
  active_esims: number
  active_vpns: number
  active_cards: number
  revenue_rub: { total: number; count: number; avg_check: number }
  revenue_usd: { total: number; count: number; avg_check: number }
  registrations_by_day: { date: string; count: number }[]
  same_day_conversions: number
  conversion_pct: number
  revenue_by_day: { date: string; amount: number }[]
}

export interface AdminUser {
  user_id: string
  email: string
  name: string
  telegram_id?: string
  vk_id?: string
  balance: number
  total_paid: number
  is_active: boolean
  plan?: string
  source?: string
  city?: string
  created_at: string
}

export interface AdminUserDetail extends AdminUser {
  is_admin: boolean
  payments: Payment[]
  esims: Esim[]
  vpns: VpnSubscription[]
  cards: VirtualCard[]
}

export interface Transaction {
  payment_id: string
  email?: string
  name?: string
  amount: number
  currency: string
  status: string
  provider?: string
  created_at: string
  confirmed_at?: string
  note?: string
}

export interface Plan {
  plan_id: string
  name: string
  slug: string
  price_usd: number
  esim_slots: number
  vpn_included: boolean
  card_slots: number
  period_days: number
  is_active: boolean
  sort_order: number
}

export interface SupportTicket {
  ticket_id: string
  user_id?: string
  email?: string
  status: string
  subject: string
  messages?: number
  created_at: string
  updated_at: string
}

export interface Esim {
  esim_id: string
  country: string
  label: string
  iccid: string
  data_gb: number
  used_gb: number
  status: string
  expires_at: string
}

export interface VpnSubscription {
  vpn_id: string
  plan: string
  server_id: string
  status: string
  expires_at: string
}

export interface VirtualCard {
  card_id: string
  last4: string
  balance: number
  currency: string
  status: string
  expiry_month: number
  expiry_year: number
}

export interface Payment {
  payment_id: string
  user_id: string
  amount: number
  currency: string
  status: string
  created_at: string
  note?: string
}

export function getStats(days = 30) {
  return adminReq<Stats>(`/v1/admin/stats?days=${days}`)
}

export function getUsers(params?: { search?: string; status?: string; source?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set("search", params.search)
  if (params?.status) q.set("status", params.status)
  if (params?.source) q.set("source", params.source)
  if (params?.limit != null) q.set("limit", String(params.limit))
  if (params?.offset != null) q.set("offset", String(params.offset))
  const qs = q.toString()
  return adminReq<AdminUser[]>(`/v1/admin/users${qs ? "?" + qs : ""}`)
}

export function getUser(id: string) {
  return adminReq<AdminUserDetail>(`/v1/admin/users/${id}`)
}

export function addBalance(id: string, amount: number, note?: string) {
  return adminReq<{ balance: number }>(`/v1/admin/users/${id}/balance`, {
    method: "POST",
    body: JSON.stringify({ amount, note }),
  })
}

export function toggleUser(id: string) {
  return adminReq<{ is_active: boolean }>(`/v1/admin/users/${id}/toggle`, {
    method: "POST",
  })
}

export function deleteUser(id: string, password: string) {
  return adminReq<{ ok: boolean; deleted_email: string }>(`/v1/admin/users/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ password }),
  })
}

export function getTransactions(params?: { limit?: number; offset?: number; status?: string; currency?: string; provider?: string }) {
  const q = new URLSearchParams()
  if (params?.limit != null) q.set("limit", String(params.limit))
  if (params?.offset != null) q.set("offset", String(params.offset))
  if (params?.status) q.set("status", params.status)
  if (params?.currency) q.set("currency", params.currency)
  if (params?.provider) q.set("provider", params.provider)
  const qs = q.toString()
  return adminReq<Transaction[]>(`/v1/admin/transactions${qs ? "?" + qs : ""}`)
}

export function getSupport(params?: { status?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.status) q.set("status", params.status)
  if (params?.limit != null) q.set("limit", String(params.limit))
  if (params?.offset != null) q.set("offset", String(params.offset))
  const qs = q.toString()
  return adminReq<SupportTicket[]>(`/v1/admin/support${qs ? "?" + qs : ""}`)
}

export function getPlans() {
  return adminReq<Plan[]>("/v1/admin/plans")
}

export function createPlan(body: Omit<Plan, 'plan_id'>) {
  return adminReq<Plan>("/v1/admin/plans", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updatePlan(planId: string, body: Omit<Plan, 'plan_id'>) {
  return adminReq<Plan>(`/v1/admin/plans/${planId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export interface Notification {
  id: string
  user_id: string
  email?: string
  notification_type: string
  title: string
  message: string
  channel: string
  is_read: boolean
  created_at: string
  read_at?: string
}

export interface Invoice {
  id: string
  user_id: string
  email?: string
  invoice_number: string
  amount: number
  currency: string
  items?: any[]
  status: string
  issued_at?: string
  due_at?: string
  paid_at?: string
}

export interface ReferralProgram {
  id: string
  referrer_id: string
  referrer_email?: string
  referral_code: string
  name: string | null
  contact: string | null
  note: string | null
  upline_id: string | null
  l1_pct: number
  l2_pct: number
  l3_pct: number
  referrer_bonus: number
  referee_bonus: number
  is_active: boolean
  total_referrals: number
  completed: number
  pending: number
  total_earned: number
  total_earned_l1: number
  total_earned_l2: number
  total_earned_l3: number
  total_paid: number
  pending_payout: number
  created_at: string
}

export interface ReferralDefaults {
  l1_pct: number
  l2_pct: number
  l3_pct: number
}

export interface CreateReferralProgramPayload {
  referral_code: string
  name?: string | null
  contact?: string | null
  note?: string | null
  upline_id?: string | null
  l1_pct: number
  l2_pct: number
  l3_pct: number
}

export interface UpdateReferralProgramPayload {
  name?: string | null
  contact?: string | null
  note?: string | null
  upline_id?: string | null
  l1_pct?: number
  l2_pct?: number
  l3_pct?: number
}

export interface ReferralPayout {
  amount: number
  detail: string | null
  created_at: string | null
}

export interface ReferralConversion {
  id: string
  referral_id: string
  referee_id: string
  referee_email?: string
  status: string
  referrer_bonus_paid: boolean
  referee_bonus_paid: boolean
  completed_at?: string
}

export function getNotifications() {
  return adminReq<Notification[]>("/v1/admin/notifications")
}

export function sendNotification(body: { user_id: string; title: string; message: string; type?: string }) {
  return adminReq<Notification>("/v1/admin/notifications/send-to-user", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function getInvoices() {
  return adminReq<Invoice[]>("/v1/admin/invoices")
}

export function markInvoicePaid(invoiceId: string) {
  return adminReq<Invoice>(`/v1/admin/invoices/${invoiceId}/mark-paid`, {
    method: "POST",
  })
}

export function getReferralPrograms() {
  return adminReq<ReferralProgram[]>("/v1/admin/referrals")
}

export function getReferralConversions(programId: string) {
  return adminReq<ReferralConversion[]>(`/v1/admin/referrals/${programId}/conversions`)
}

export function toggleReferralProgram(programId: string) {
  return adminReq<ReferralProgram>(`/v1/admin/referrals/${programId}/toggle`, {
    method: "POST",
  })
}

export function createReferralProgram(payload: CreateReferralProgramPayload) {
  return adminReq<ReferralProgram>("/v1/admin/referrals", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateReferralProgram(programId: string, payload: UpdateReferralProgramPayload) {
  return adminReq<ReferralProgram>(`/v1/admin/referrals/${programId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function getReferralDefaults() {
  return adminReq<ReferralDefaults>("/v1/admin/referral-defaults")
}

export function updateReferralDefaults(payload: ReferralDefaults) {
  return adminReq<ReferralDefaults>("/v1/admin/referral-defaults", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function recordReferralPayout(programId: string, amount: number) {
  return adminReq<{ id: string; referral_code: string; total_paid: number }>(
    `/v1/admin/referrals/${programId}/payout`,
    { method: "POST", body: JSON.stringify({ amount }) },
  )
}

export function getReferralPayouts(programId: string) {
  return adminReq<ReferralPayout[]>(`/v1/admin/referrals/${programId}/payouts`)
}

export function generatePartnerSetupLink(programId: string) {
  return adminReq<{ setup_url: string; expires_at: string }>(
    `/v1/admin/referrals/${programId}/setup-link`,
    { method: "POST" },
  )
}

export interface Subscription {
  id: string
  user_id: string
  email: string
  name?: string
  plan_id: string
  plan_name: string
  plan_slug: string
  price_usd: number
  status: 'active' | 'expired' | 'cancelled'
  auto_renew: boolean
  starts_at: string
  expires_at: string
}

export function getSubscriptions(params?: { status?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.status) q.set("status", params.status)
  if (params?.limit != null) q.set("limit", String(params.limit))
  if (params?.offset != null) q.set("offset", String(params.offset))
  const qs = q.toString()
  return adminReq<Subscription[]>(`/v1/admin/subscriptions${qs ? "?" + qs : ""}`)
}

export function updateSubscription(subId: string, body: {
  plan_id?: string
  status?: string
  auto_renew?: boolean
  extend_days?: number
}) {
  return adminReq<Subscription>(`/v1/admin/subscriptions/${subId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export interface AdminVpnSub {
  id: string
  user_id: string
  email?: string
  name?: string
  plan: string
  server_id?: string
  provider: 'remnawave' | 'mock' | 'unknown'
  status: string
  expires_at?: string
  created_at?: string
  has_key: boolean
}

export function getVpnSubs(params?: { status?: string; provider?: string; limit?: number }) {
  const q = new URLSearchParams()
  if (params?.status) q.set("status", params.status)
  if (params?.provider) q.set("provider", params.provider)
  if (params?.limit != null) q.set("limit", String(params.limit))
  const qs = q.toString()
  return adminReq<AdminVpnSub[]>(`/v1/admin/vpn${qs ? "?" + qs : ""}`)
}

export function recreateVpn(vpnId: string) {
  return adminReq<{ id: string; provider: string; status: string }>(`/v1/admin/vpn/${vpnId}/recreate`, { method: "POST" })
}

export function revokeVpnAdmin(vpnId: string) {
  return adminReq<{ id: string; status: string }>(`/v1/admin/vpn/${vpnId}/revoke`, { method: "POST" })
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface GscSummary {
  clicks: number; impressions: number; ctr: number; position: number
}

export interface GscRow {
  query?: string; page?: string; clicks: number; impressions: number; ctr: number; position: number
}

export interface GscDateRow { date: string; clicks: number; impressions: number }

export interface GscData {
  summary: GscSummary
  top_queries: GscRow[]
  top_pages: GscRow[]
  by_date: GscDateRow[]
  site_url: string
  days: number
  cached: boolean
}

export interface MetricaSummary {
  visits: number; pageviews: number; users: number; bounce_rate: number
}

export interface MetricaDateRow { date: string; visits: number; pageviews: number }
export interface MetricaPageRow { page: string; visits: number; pageviews: number }
export interface MetricaSourceRow { source: string; visits: number }

export interface MetricaData {
  summary: MetricaSummary
  by_date: MetricaDateRow[]
  top_pages: MetricaPageRow[]
  sources: MetricaSourceRow[]
  days: number
  cached: boolean
}

export function getGscStats(days = 28) {
  return adminReq<GscData>(`/v1/admin/analytics/gsc?days=${days}`)
}

export function getMetricaStats(days = 28) {
  return adminReq<MetricaData>(`/v1/admin/analytics/metrica?days=${days}`)
}

export function clearAnalyticsCache() {
  return adminReq<{ ok: boolean }>("/v1/admin/analytics/cache/clear", { method: "POST" })
}

// ---------------------------------------------------------------------------
// Promocodes
// ---------------------------------------------------------------------------

export interface Promocode {
  id: string
  code: string
  description: string | null
  discount_type: 'percent' | 'fixed' | 'vpn_trial'
  discount_value: number
  current_uses: number
  max_uses: number | null
  is_active: boolean
  valid_from: string | null
  valid_until: string | null
  referral_program_id: string | null
  referral_partner_name: string | null
}

export interface CreatePromocodePayload {
  code: string
  description?: string
  discount_type: string
  discount_value: number
  max_uses?: number | null
  valid_until?: string | null
  referral_program_id?: string | null
}

export function listPromocodes() {
  return adminReq<Promocode[]>("/v1/admin/promocodes")
}

export function createPromocode(payload: CreatePromocodePayload) {
  return adminReq<Promocode>("/v1/admin/promocodes", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function togglePromocode(promoId: string) {
  return adminReq<{ is_active: boolean }>(`/v1/admin/promocodes/${promoId}/toggle`, {
    method: "POST",
  })
}
