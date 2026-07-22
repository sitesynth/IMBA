'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/auth'
import { GoogleButton, AuthError, OrDivider } from '@/components/GoogleButton'
import { VKLoginButton } from '@/components/VKLoginButton'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const params = useSearchParams()
  const errorCode = params.get('error') ?? undefined
  const redirectTo = params.get('redirect') ?? ''

  return (
    <div className="panel">
      <AuthError code={errorCode} />
      <div className="space-y-2.5">
        <GoogleButton />
        <VKLoginButton />
      </div>
      <OrDivider />
      <form action={action} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
        {state?.message && (
          <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
            {state.message}
          </div>
        )}
        <Field label="Email" name="email" type="email" placeholder="you@example.com" error={state?.errors?.email?.[0]} />
        <Field label="Password" name="password" type="password" placeholder="••••••••" error={state?.errors?.password?.[0]} />
        <div className="flex items-center justify-between mt-1 mb-1">
          <span />
          <Link href="/auth/forgot-password" className="text-xs font-bold text-ink/50 hover:text-ink underline underline-offset-2">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60 mt-2">
          {pending ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, name, type, placeholder, error }: {
  label: string; name: string; type: string; placeholder: string; error?: string
}) {
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
