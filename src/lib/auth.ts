'use server'
import { redirect } from 'next/navigation'
import { ApiError, api, apiFetch, clearApiToken, hasApiToken, setApiToken } from './api'
import { sendWelcomeEmail, sendPasswordResetEmail } from './email'
import type { UserProfile } from './types'
import type { FormState } from './definitions'

type AuthResponse = {
  token: string
  user_id: string
  email: string
  name: string | null
}

function safeRedirect(path: string | null | undefined): string {
  if (!path || !path.startsWith('/')) return '/dashboard'
  return path
}

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string | null

  const errors: NonNullable<FormState>['errors'] = {}
  if (!name || name.length < 2) errors.name = ['Имя должно быть не менее 2 символов']
  if (!email || !email.includes('@')) errors.email = ['Введите корректный email']
  if (!password || password.length < 6) errors.password = ['Пароль должен быть не менее 6 символов']
  if (Object.keys(errors).length > 0) return { errors }

  try {
    const frontend_url = (formData.get('frontend_url') as string) || undefined
    await apiFetch<{ status: string; email: string }>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, frontend_url }),
      skipAuth: true,
    })
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 409) return { errors: { email: [e.message || 'Пользователь с таким email уже существует'] } }
      return { message: e.message }
    }
    return { message: 'Не удалось зарегистрироваться. Сервер недоступен.' }
  }

  redirect('/auth/check-email?email=' + encodeURIComponent(email))
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string | null
  if (!email || !password) return { message: 'Заполните все поля' }

  try {
    const res = await apiFetch<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    })
    await setApiToken(res.token)
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 401) return { message: 'Неверный email или пароль' }
      if (e.status === 409) return { message: e.message }
    }
    return { message: 'Не удалось войти. Сервер недоступен.' }
  }

  redirect(safeRedirect(redirectTo))
}

export async function logout() {
  await clearApiToken()
  redirect('/')
}

export async function forgotPassword(_: FormState, formData: FormData): Promise<FormState> {
  const email = (formData.get('email') as string)?.trim()
  if (!email || !email.includes('@')) return { errors: { email: ['Введите корректный email'] } }

  try {
    const apiUrl = process.env.IMBA_API_URL ?? 'http://localhost:8100'
    const res = await fetch(`${apiUrl}/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.token) {
        await sendPasswordResetEmail(data.email, data.name, data.token).catch(() => null)
      }
    }
  } catch {
    // Always show success to prevent email enumeration
  }

  return { message: 'ok' }
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || password.length < 6) return { errors: { password: ['Минимум 6 символов'] } }
  if (password !== confirm) return { errors: { confirm: ['Пароли не совпадают'] } }

  try {
    const apiUrl = process.env.IMBA_API_URL ?? 'http://localhost:8100'
    const res = await fetch(`${apiUrl}/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    if (!res.ok) return { message: 'Ссылка устарела или уже использована.' }
  } catch {
    return { message: 'Не удалось сбросить пароль. Попробуй позже.' }
  }

  redirect('/auth/login?reset=1')
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!(await hasApiToken())) return null
  try {
    return await api.get<UserProfile>('/v1/me')
  } catch {
    // Cannot write cookies during Server Component render (Next.js 15+).
    // The stale token will be cleared on the next server action (login/logout).
    return null
  }
}
