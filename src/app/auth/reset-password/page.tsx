'use client'
import Link from 'next/link'
import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/auth'
import { Logo } from '@/components/Logo'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  )
}

function ResetForm() {
  const token = useSearchParams().get('token') ?? ''
  const [state, action, pending] = useActionState(resetPassword, undefined)

  if (!token) {
    return (
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm fade-up text-center">
          <div className="flex justify-center mb-5"><Logo size="lg" /></div>
          <div className="panel">
            <p className="font-bold text-ink/60">Ссылка недействительна. Запроси сброс пароля заново.</p>
          </div>
          <p className="text-center font-semibold text-ink/60 mt-5">
            <Link href="/auth/forgot-password" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
              Запросить снова →
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
          <h1 className="display text-3xl mb-1">Новый пароль</h1>
          <p className="font-semibold text-ink/60">Придумай надёжный пароль</p>
        </div>

        <div className="panel">
          <form action={action} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            {state?.message && (
              <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
                {state.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-extrabold mb-1.5">Новый пароль</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Минимум 6 символов"
                className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors"
              />
              {state?.errors?.password && (
                <p className="text-red-600 text-xs font-bold mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-extrabold mb-1.5">Повтори пароль</label>
              <input
                name="confirm"
                type="password"
                required
                placeholder="Ещё раз"
                className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors"
              />
              {state?.errors?.confirm && (
                <p className="text-red-600 text-xs font-bold mt-1">{state.errors.confirm[0]}</p>
              )}
            </div>

            <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60">
              {pending ? 'Сохраняем…' : 'Сохранить пароль →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
