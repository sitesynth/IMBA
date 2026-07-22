import { Suspense } from 'react'
import { LottieSticker } from '@/components/LottieSticker'
import { LoginForm } from './LoginForm'

function FormSkeleton() {
  return (
    <div className="panel space-y-4">
      <div style={{ height: 48, background: 'var(--ink)', opacity: 0.08, borderRadius: 16 }} />
      <div style={{ height: 1, background: 'var(--ink)', opacity: 0.1 }} />
      <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
      <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
      <div style={{ height: 48, background: 'var(--ink)', opacity: 0.1, borderRadius: 16, marginTop: 8 }} />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-4">
            <LottieSticker name="approved" size={88} />
          </div>
          <h1 className="display text-3xl mb-1">Welcome back</h1>
          <p className="font-semibold text-ink/60">Sign in to your dashboard</p>
        </div>

        <Suspense fallback={<FormSkeleton />}>
          <LoginForm />
        </Suspense>

        <p className="text-center font-semibold text-ink/60 mt-5">
          No account?{' '}
          <a href="/auth/register" className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}
