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

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ for?: string; redirect?: string }> }) {
  const { for: audience, redirect } = await searchParams
  const partner = audience === 'partner'
  const registerHref = partner
    ? `/auth/register?for=partner&redirect=${encodeURIComponent(redirect || '/api/cabinet')}`
    : '/auth/register'
  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-4">
            <LottieSticker name="approved" size={88} />
          </div>
          <h1 className="display text-3xl mb-1">{partner ? 'IMBA API cabinet' : 'Welcome back'}</h1>
          <p className="font-semibold text-ink/60">
            {partner ? 'Sign in with your IMBA account to open the API cabinet' : 'Sign in to your dashboard'}
          </p>
        </div>

        <Suspense fallback={<FormSkeleton />}>
          <LoginForm />
        </Suspense>

        <p className="text-center font-semibold text-ink/60 mt-5">
          No account?{' '}
          <a href={registerHref} className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}
