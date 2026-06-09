const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://138.2.134.17:8100"
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

async function adminReq<T>(path: string, options: RequestInit = {}): Promise<T> {
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
}

export interface AdminUser {
  user_id: string
  email: string
  name: string
  balance: number
  is_active: boolean
  plan?: string
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
  amount: number
  currency: string
  status: string
  created_at: string
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

export function getStats() {
  return adminReq<Stats>("/v1/admin/stats")
}

export function getUsers(params?: { search?: string; status?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set("search", params.search)
  if (params?.status) q.set("status", params.status)
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

export function getTransactions(params?: { limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.limit != null) q.set("limit", String(params.limit))
  if (params?.offset != null) q.set("offset", String(params.offset))
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
  referrer_bonus: number
  referee_bonus: number
  is_active: boolean
  total_referrals: number
  completed: number
  pending: number
  total_earned: number
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
