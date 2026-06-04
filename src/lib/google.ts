import { prisma } from './db'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO = 'https://www.googleapis.com/oauth2/v2/userinfo'

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

function redirectUri() {
  const base = process.env.APP_URL ?? 'http://localhost:3100'
  return `${base}/api/auth/google/callback`
}

export function buildAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  })
  return `${GOOGLE_AUTH}?${params.toString()}`
}

type GoogleProfile = { email: string; name: string; picture?: string }

export async function exchangeCodeForProfile(code: string): Promise<GoogleProfile> {
  const tokenRes = await fetch(GOOGLE_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
  })
  if (!tokenRes.ok) throw new Error('token exchange failed')
  const { access_token } = await tokenRes.json()

  const infoRes = await fetch(GOOGLE_USERINFO, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!infoRes.ok) throw new Error('userinfo failed')
  const info = await infoRes.json()
  return { email: info.email, name: info.name ?? info.email.split('@')[0], picture: info.picture }
}

/** Upsert a Google user, seeding demo data for first-time accounts. Returns user id. */
export async function upsertGoogleUser(profile: GoogleProfile): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email: profile.email } })
  if (existing) return existing.id

  const password = await bcrypt.hash(crypto.randomUUID(), 10)
  const user = await prisma.user.create({
    data: { name: profile.name, email: profile.email, password },
  })

  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.esim.create({
    data: { userId: user.id, label: 'Турция 🇹🇷', country: 'TR', dataGb: 10, usedGb: 3.2, status: 'active', expiresAt: future },
  })
  await prisma.vpnSubscription.create({
    data: { userId: user.id, plan: 'pro', status: 'active', serverKey: 'wg://vpn.example.com:51820?key=DEMO_KEY', expiresAt: future },
  })
  const card = await prisma.virtualCard.create({
    data: { userId: user.id, last4: '4242', balance: 250, currency: 'USD', status: 'active', cardHolder: profile.name.toUpperCase(), expiryMonth: 12, expiryYear: 2027 },
  })
  await prisma.transaction.createMany({
    data: [
      { cardId: card.id, amount: -15.99, merchant: 'Spotify', type: 'debit' },
      { cardId: card.id, amount: -49.0, merchant: 'Adobe Creative Cloud', type: 'debit' },
      { cardId: card.id, amount: 100.0, merchant: 'Пополнение', type: 'credit' },
    ],
  })
  return user.id
}
