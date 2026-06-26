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
        body: JSON.stringify({ email }),
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
          Почти готово
        </div>

        <h1 className="display text-3xl mb-3" style={{ lineHeight: 1.1 }}>
          Проверь<br />
          <span style={{ color: '#7B61FF' }}>почтовый ящик</span>
        </h1>

        <p className="font-semibold text-ink/60 text-sm mb-6">
          Мы отправили письмо с подтверждением на{' '}
          <span className="font-extrabold text-ink">{email || 'твой email'}</span>.
          Нажми кнопку в письме чтобы войти.
        </p>

        <div className="panel mb-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 mt-0.5 text-ink/40 flex-shrink-0" />
            <p className="text-sm font-semibold text-ink/60">
              Письмо может прийти за 1–2 минуты. Проверь папку «Спам» если не видишь его.
            </p>
          </div>
        </div>

        {sent ? (
          <p className="text-sm font-bold text-green-600 mb-4">Письмо отправлено повторно ✓</p>
        ) : (
          <button
            onClick={resend}
            disabled={loading}
            className="pill pill-sm w-full justify-center mb-4 disabled:opacity-50"
            style={{ background: 'transparent', border: '2px solid var(--ink)' }}
          >
            {loading ? 'Отправляем…' : 'Отправить письмо повторно'}
          </button>
        )}

        <Link href="/auth/login" className="text-sm font-bold text-ink/40 hover:text-ink underline underline-offset-2">
          ← Вернуться к входу
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
