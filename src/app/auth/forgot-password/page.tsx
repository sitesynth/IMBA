'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { forgotPassword } from '@/lib/auth'
import { Logo } from '@/components/Logo'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  if (state?.message === 'ok') {
    return (
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm fade-up text-center">
          <div className="flex justify-center mb-5"><Logo size="lg" /></div>
          <div className="panel">
            <div className="text-4xl mb-3">📬</div>
            <h1 className="display text-2xl mb-2">Письмо отправлено</h1>
            <p className="font-semibold text-ink/60 text-sm">
              Если аккаунт с таким email существует — ссылка для сброса уже в почте. Проверь папку «Спам».
            </p>
          </div>
          <p className="text-center font-semibold text-ink/60 mt-5">
            <Link href="/auth/login" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
              ← Вернуться к входу
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-5"><Logo size="lg" /></div>
          <h1 className="display text-3xl mb-1">Забыл пароль?</h1>
          <p className="font-semibold text-ink/60">Пришлём ссылку для сброса на email</p>
        </div>

        <div className="panel">
          <form action={action} className="space-y-4">
            {state?.message && state.message !== 'ok' && (
              <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
                {state.message}
              </div>
            )}
            <div>
              <label className="block text-sm font-extrabold mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors"
              />
              {state?.errors?.email && (
                <p className="text-red-600 text-xs font-bold mt-1">{state.errors.email[0]}</p>
              )}
            </div>
            <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60">
              {pending ? 'Отправляем…' : 'Отправить ссылку →'}
            </button>
          </form>
        </div>

        <p className="text-center font-semibold text-ink/60 mt-5">
          <Link href="/auth/login" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
            ← Вернуться к входу
          </Link>
        </p>
      </div>
    </div>
  )
}
