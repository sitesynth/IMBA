'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/auth'
import { Logo } from '@/components/Logo'

export function ResetForm() {
  const token = useSearchParams().get('token') ?? ''
  const [state, action, pending] = useActionState(resetPassword, undefined)

  if (!token) {
    return (
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm fade-up text-center">
          <div className="flex justify-center mb-5"><Logo size="lg" /></div>
          <div className="panel">
            <p className="font-bold text-ink/60">This link is invalid. Request a new password reset.</p>
          </div>
          <p className="text-center font-semibold text-ink/60 mt-5">
            <Link href="/auth/forgot-password" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
              Request again →
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
          <h1 className="display text-3xl mb-1">New password</h1>
          <p className="font-semibold text-ink/60">Choose a strong password</p>
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
              <label className="block text-sm font-extrabold mb-1.5">New password</label>
              <input name="password" type="password" required placeholder="At least 6 characters"
                className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors" />
              {state?.errors?.password && <p className="text-red-600 text-xs font-bold mt-1">{state.errors.password[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-extrabold mb-1.5">Confirm password</label>
              <input name="confirm" type="password" required placeholder="Again"
                className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-semibold text-sm bg-cream focus:bg-paper transition-colors" />
              {state?.errors?.confirm && <p className="text-red-600 text-xs font-bold mt-1">{state.errors.confirm[0]}</p>}
            </div>
            <button type="submit" disabled={pending} className="pill pill-ink w-full justify-center disabled:opacity-60">
              {pending ? 'Saving…' : 'Save password →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
