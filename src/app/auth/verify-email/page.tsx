'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const ran = useRef(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || ran.current) return
    ran.current = true

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'This link is invalid or has already been used')
          return
        }
        router.replace('/dashboard?welcome=1')
      })
      .catch(() => setError('Network error. Please try again.'))
  }, [token])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--cream)' }}>
        <div className="w-full max-w-sm fade-up text-center">
          <Link href="/" className="inline-block mb-6"><Logo size="lg" /></Link>
          <div className="panel mb-4">
            <p className="font-bold text-red-600 mb-4">{error}</p>
            <Link href="/auth/register" className="pill pill-ink w-full justify-center" style={{ display: 'flex' }}>
              Create a new account
            </Link>
          </div>
          <Link href="/auth/login" className="text-sm font-bold text-ink/40 hover:text-ink underline underline-offset-2">
            ← Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <Link href="/" className="inline-block mb-6"><Logo size="lg" /></Link>
        <p className="font-bold text-ink/60">Verifying email…</p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
