'use client'
import Link from 'next/link'
import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signup } from '@/lib/auth'
import { Logo } from '@/components/Logo'
import { GoogleButton, AuthError, OrDivider } from '@/components/GoogleButton'

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const errorCode = useSearchParams().get('error') ?? undefined

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-6"><Logo size="lg" /></div>
          <h1 className="display text-3xl mb-1">Создать аккаунт</h1>
          <p className="font-semibold text-ink/60">Бесплатно. Без привязки карты.</p>
        </div>

        <div className="panel">
          <AuthError code={errorCode} />

          <GoogleButton label="Регистрация через Google" />
          <OrDivider />

          <form action={action} className="space-y-4">
            {state?.message && (
              <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
                {state.message}
              </div>
            )}

            <Field label="Имя" name="name" type="text" placeholder="Иван Петров" error={state?.errors?.name?.[0]} />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" error={state?.errors?.email?.[0]} />
            <Field label="Пароль" name="password" type="password" placeholder="Минимум 6 символов" error={state?.errors?.password?.[0]} />

            <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60 mt-2">
              {pending ? 'Создаём…' : 'Зарегистрироваться →'}
            </button>
          </form>
        </div>

        <p className="text-center font-semibold text-ink/60 mt-5">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, name, type, placeholder, error }: { label: string; name: string; type: string; placeholder: string; error?: string }) {
  return (
    <div>
      <label className="block text-sm font-extrabold mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors"
      />
      {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
    </div>
  )
}
