'use client'
import { useActionState, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { signup } from '@/lib/auth'
import { GoogleButton, AuthError, OrDivider } from '@/components/GoogleButton'

export function RegisterForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const params = useSearchParams()
  const errorCode = params.get('error') ?? undefined
  const redirectTo = params.get('redirect') ?? ''
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  return (
    <div className="panel">
      <AuthError code={errorCode} />
      <GoogleButton label="Continue with Google" />
      <OrDivider />
      <form action={action} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
        {origin && <input type="hidden" name="frontend_url" value={origin} />}
        {state?.message && (
          <div className="border-2 border-ink rounded-2xl px-4 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>
            {state.message}
          </div>
        )}
        <Field label="Name" name="name" type="text" placeholder="Alex Smith" error={state?.errors?.name?.[0]} />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" error={state?.errors?.email?.[0]} />
        <Field label="Password" name="password" type="password" placeholder="At least 6 characters" error={state?.errors?.password?.[0]} />
        <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60 mt-2">
          {pending ? 'Creating account…' : 'Create account →'}
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
