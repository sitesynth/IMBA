'use server'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { createSession, deleteSession, getSession } from './session'
import { redirect } from 'next/navigation'
import type { FormState } from './definitions'

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const errors: NonNullable<FormState>['errors'] = {}
  if (!name || name.length < 2) errors.name = ['Имя должно быть не менее 2 символов']
  if (!email || !email.includes('@')) errors.email = ['Введите корректный email']
  if (!password || password.length < 6) errors.password = ['Пароль должен быть не менее 6 символов']

  if (Object.keys(errors).length > 0) return { errors }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { errors: { email: ['Пользователь с таким email уже существует'] } }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, password: hashed } })

  // Seed demo data for new user
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.esim.create({
    data: {
      userId: user.id,
      label: 'Турция 🇹🇷',
      country: 'TR',
      dataGb: 10,
      usedGb: 3.2,
      status: 'active',
      expiresAt: future,
    },
  })
  await prisma.vpnSubscription.create({
    data: {
      userId: user.id,
      plan: 'pro',
      status: 'active',
      serverKey: 'wg://vpn.example.com:51820?key=DEMO_KEY_REPLACE',
      expiresAt: future,
    },
  })
  const card = await prisma.virtualCard.create({
    data: {
      userId: user.id,
      last4: '4242',
      balance: 250.0,
      currency: 'USD',
      status: 'active',
      cardHolder: name.toUpperCase(),
      expiryMonth: 12,
      expiryYear: 2027,
    },
  })
  await prisma.transaction.createMany({
    data: [
      { cardId: card.id, amount: -15.99, merchant: 'Spotify', type: 'debit' },
      { cardId: card.id, amount: -49.0, merchant: 'Adobe Creative Cloud', type: 'debit' },
      { cardId: card.id, amount: 100.0, merchant: 'Пополнение', type: 'credit' },
    ],
  })

  await createSession(user.id)
  redirect('/dashboard')
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { message: 'Заполните все поля' }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { message: 'Неверный email или пароль' }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return { message: 'Неверный email или пароль' }

  await createSession(user.id)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/')
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  return prisma.user.findUnique({ where: { id: session.userId } })
}
