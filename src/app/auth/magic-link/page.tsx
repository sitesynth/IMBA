'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function MagicLinkVerify() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')
  const ran = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ran.current || !token) return
    ran.current = true

    fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token }),
    }).then(async (res) => {
      if (res.ok) {
        router.replace('/dashboard')
      } else {
        const err = await res.json().catch(() => ({}))
        setError(err.error || 'Ссылка недействительна или уже использована')
      }
    }).catch(() => {
      setError('Произошла ошибка. Попробуй ещё раз.')
    })
  }, [token, router])

  if (!token) {
    return (
      <div className="panel" style={{ textAlign: 'center' }}>
        <p className="text-sm font-bold text-ink/60">Ссылка недействительна.</p>
        <Link href="/auth/login" className="pill pill-ink mt-4 inline-flex">← Войти</Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="panel" style={{ textAlign: 'center' }}>
        <div className="mb-4 flex justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p className="font-bold text-sm mb-2">Ссылка устарела</p>
        <p className="text-sm text-ink/60 mb-6">{error}</p>
        <Link href="/auth/login" className="pill pill-ink inline-flex">Запросить новую →</Link>
      </div>
    )
  }

  return (
    <div className="panel" style={{ textAlign: 'center' }}>
      <div className="mb-4 flex justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 animate-pulse">
            <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
          </svg>
        </div>
      <p className="font-bold text-sm">Вхожу в аккаунт…</p>
    </div>
  )
}

export default function MagicLinkPage() {
  return (
    <Suspense fallback={
      <div className="panel" style={{ textAlign: 'center' }}>
        <p className="font-bold text-sm">Loading…</p>
      </div>
    }>
      <MagicLinkVerify />
    </Suspense>
  )
}
