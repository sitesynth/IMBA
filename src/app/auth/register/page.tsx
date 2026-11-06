import { Suspense } from 'react'
import { LottieSticker } from '@/components/LottieSticker'
import { RegisterForm } from './RegisterForm'

function FormSkeleton() {
  return (
    <div className="panel space-y-4">
      <div style={{ height: 48, background: 'var(--ink)', opacity: 0.08, borderRadius: 16 }} />
      <div style={{ height: 1, background: 'var(--ink)', opacity: 0.1 }} />
      <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
      <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
      <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
      <div style={{ height: 48, background: 'var(--ink)', opacity: 0.1, borderRadius: 16, marginTop: 8 }} />
    </div>
  )
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ for?: string; redirect?: string }> }) {
  const { for: audience, redirect } = await searchParams
  const partner = audience === 'partner'
  const loginHref = partner
    ? `/auth/login?for=partner&redirect=${encodeURIComponent(redirect || '/api/cabinet')}`
    : '/auth/login'
  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-4">
            <LottieSticker name="keys" size={96} />
          </div>
          <h1 className="display text-4xl mb-1">{partner ? 'IMBA API cabinet' : 'Create account'}</h1>
          <p className="font-semibold text-ink/60">
            {partner
              ? 'One IMBA account for the API cabinet: get your key and sell eSIM and VPN.'
              : 'Sign up with email. First month just $0.56.'}
          </p>
        </div>

        <Suspense fallback={<FormSkeleton />}>
          <RegisterForm />
        </Suspense>

        <p className="text-center font-semibold text-ink/60 mt-5">
          Already have an account?{' '}
          <a href={loginHref} className="font-extrabold text-ink hover:opacity-60 underline underline-offset-2">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
