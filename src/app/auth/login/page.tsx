'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/auth'
import { Logo } from '@/components/Logo'
import { LottieSticker } from '@/components/LottieSticker'
import { GoogleButton, AuthError, OrDivider } from '@/components/GoogleButton'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const params = useSearchParams()
  const errorCode = params.get('error') ?? undefined
  const redirectTo = params.get('redirect') ?? ''

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-5"><Logo size="lg" /></div>
          <div className="flex items-center justify-center gap-3 mb-1">
            <LottieSticker name="approved" size={80} />
            <h1 className="display text-4xl" style={{ whiteSpace: 'nowrap', textWrap: 'nowrap' }}>С возвращением</h1>
          </div>
          <p className="font-semibold text-ink/60">Войди в свой кабинет</p>
        </div>

        <div className="panel">
          <AuthError code={errorCode} />

          <GoogleButton />
          <OrDivider />

          <form action={action} className="space-y-4">
            {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
            {state?.message && (
              <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
                {state.message}
              </div>
            )}

            <Field label="Email" name="email" type="email" placeholder="you@example.com" error={state?.errors?.email?.[0]} />
            <Field label="Пароль" name="password" type="password" placeholder="••••••••" error={state?.errors?.password?.[0]} />

            <div className="flex items-center justify-between mt-1 mb-1">
              <span />
              <Link href="/auth/forgot-password" className="text-xs font-bold text-ink/50 hover:text-ink underline underline-offset-2">
                Забыл пароль?
              </Link>
            </div>

            <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60 mt-2">
              {pending ? 'Входим…' : 'Войти →'}
            </button>
          </form>
        </div>

        <p className="text-center font-semibold text-ink/60 mt-5">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
            Зарегистрироваться
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
