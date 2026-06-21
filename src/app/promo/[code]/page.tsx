import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Gift, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { apiFetch, ApiError } from '@/lib/api'
import { Logo } from '@/components/Logo'
import { LottieSticker } from '@/components/LottieSticker'

const APP_URL = process.env.APP_URL ?? 'https://imba.live'

export default async function PromoLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params
  const code = rawCode.toUpperCase()
  const user = await getCurrentUser()

  async function claimPromo(_formData: FormData) {
    'use server'
    try {
      await apiFetch('/v1/me/promo/redeem', {
        method: 'POST',
        body: JSON.stringify({ code }),
      })
    } catch (e) {
      if (e instanceof ApiError) console.error('promo claim failed:', e.message)
    }
    revalidatePath('/dashboard')
    redirect('/dashboard?promo=claimed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--cream)' }}>
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-7">
          <Link href="/" className="inline-block mb-6">
            <Logo size="lg" />
          </Link>

          <div className="flex justify-center mb-4">
            <LottieSticker name="rocket" size={96} />
          </div>

          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4"
            style={{ background: 'var(--yellow)', color: 'var(--ink)' }}
          >
            Подарок
          </div>

          <h1 className="display text-4xl mb-2" style={{ lineHeight: 1.05 }}>
            Тебе начислено<br />
            <span style={{ color: 'var(--yellow)', WebkitTextStroke: '1.5px var(--ink)' }}>$50.00</span>
          </h1>
          <p className="font-semibold text-ink/60 text-sm">
            Трать на eSIM, VPN и виртуальную карту
          </p>
        </div>

        <div className="panel mb-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-2">
            Промокод
          </div>
          <div
            className="text-2xl font-black tracking-[4px] font-mono px-4 py-3 rounded-2xl text-center"
            style={{ background: 'var(--cream)', border: '2px dashed #c0b8a8' }}
          >
            {code}
          </div>
        </div>

        {user ? (
          <form action={claimPromo}>
            <button
              type="submit"
              className="pill pill-ink w-full justify-center text-base"
            >
              <Gift className="w-5 h-5" strokeWidth={2.5} />
              Получить $50 на баланс
            </button>
            <p className="text-center text-xs font-semibold text-ink/40 mt-3">
              Зачислится сразу — трать на что угодно
            </p>
          </form>
        ) : (
          <div className="space-y-3">
            <Link
              href={`${APP_URL}/auth/login?redirect=/promo/${code}`}
              className="pill pill-ink w-full justify-center text-base"
              style={{ display: 'flex' }}
            >
              Войти и получить $50
              <ArrowRight className="w-5 h-5 ml-1" strokeWidth={2.5} />
            </Link>
            <Link
              href={`${APP_URL}/auth/register?redirect=/promo/${code}`}
              className="pill pill-paper w-full justify-center text-base border-2 border-ink"
              style={{ display: 'flex' }}
            >
              Зарегистрироваться
              <ArrowRight className="w-5 h-5 ml-1" strokeWidth={2.5} />
            </Link>
            <p className="text-center text-xs font-semibold text-ink/40">
              Промокод применится автоматически после входа
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl px-4 py-3 text-xs font-semibold text-ink/50 text-center" style={{ background: 'var(--paper)', border: '1.5px solid #e8e1d4' }}>
          eSIM · VPN · Виртуальная карта · 190+ стран
        </div>
      </div>
    </div>
  )
}
