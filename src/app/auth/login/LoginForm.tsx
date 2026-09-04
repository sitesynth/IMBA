'use client'
import Link from 'next/link'
import { useActionState, useState } from 'react'
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
        <MagicLinkSection />
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

function MagicLinkSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: email.trim() }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        const err = await res.json().catch(() => ({}))
        setErrMsg(err.error || 'Ошибка. Попробуй ещё раз.')
        setStatus('error')
      }
    } catch {
      setErrMsg('Ошибка соединения.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border-2 border-ink rounded-2xl px-4 py-3 text-sm font-bold text-center flex items-center justify-center gap-2" style={{ background: '#FFF9CC' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
        Письмо отправлено! Проверь почту — ссылка действует 15 минут.
      </div>
    )
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email для входа без пароля"
        required
        className="flex-1 px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors min-w-0"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="pill pill-ink whitespace-nowrap disabled:opacity-60 shrink-0"
      >
        {status === 'loading' ? '…' : '→'}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-xs font-bold mt-1 absolute">{errMsg}</p>
      )}
    </form>
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
