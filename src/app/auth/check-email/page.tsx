'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { LottieSticker } from '@/components/LottieSticker'
import { Mail } from 'lucide-react'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function resend() {
    if (!email || loading) return
    setLoading(true)
    try {
      await fetch('/api/v1/auth/resend-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frontend_url: window.location.origin }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--cream)' }}>
      <div className="w-full max-w-sm fade-up text-center">
        <Link href="/" className="inline-block mb-6">
          <Logo size="lg" />
        </Link>

        <div className="flex justify-center mb-5">
          <LottieSticker name="rocket" size={96} />
        </div>

        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4"
          style={{ background: 'var(--yellow)', color: 'var(--ink)' }}
        >
          Almost there
        </div>

        <h1 className="display text-3xl mb-3" style={{ lineHeight: 1.1 }}>
          Check your<br />
          <span style={{ color: '#7B61FF' }}>inbox</span>
        </h1>

        <p className="font-semibold text-ink/60 text-sm mb-6">
          We sent a confirmation link to{' '}
          <span className="font-extrabold text-ink">{email || 'your email'}</span>.
          Click the button in the email to sign in.
        </p>

        <div className="panel mb-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 mt-0.5 text-ink/40 flex-shrink-0" />
            <p className="text-sm font-semibold text-ink/60">
              The email may take 1–2 minutes to arrive. Check your Spam folder if you don&apos;t see it.
            </p>
          </div>
        </div>

        {sent ? (
          <p className="text-sm font-bold text-green-600 mb-4">Email resent ✓</p>
        ) : (
          <button
            onClick={resend}
            disabled={loading}
            className="pill pill-sm w-full justify-center mb-4 disabled:opacity-50"
            style={{ background: 'transparent', border: '2px solid var(--ink)' }}
          >
            {loading ? 'Sending…' : 'Resend email'}
          </button>
        )}

        <Link href="/auth/login" className="text-sm font-bold text-ink/40 hover:text-ink underline underline-offset-2">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  )
}
