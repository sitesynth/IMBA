import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

interface Props {
  searchParams: Promise<{ status?: string; provider?: string }>
}

export default async function TopupResultPage({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const { status, provider } = await searchParams
  const isSuccess = status === 'success'
  const isFailed = status === 'failed'

  if (!isSuccess && !isFailed) {
    redirect('/dashboard/billing')
  }

  return (
    <div className="fade-up max-w-md mx-auto pt-8 pb-12 text-center">
      {isSuccess ? (
        <>
          <div className="text-6xl mb-6">✅</div>
          <h1 className="display text-3xl mb-2">Оплата прошла</h1>
          <p className="text-ink/60 font-semibold mb-8">
            Средства зачислены на ваш баланс. Спасибо!
          </p>
        </>
      ) : (
        <>
          <div className="text-6xl mb-6">❌</div>
          <h1 className="display text-3xl mb-2">Оплата не прошла</h1>
          <p className="text-ink/60 font-semibold mb-8">
            Что-то пошло не так. Попробуйте ещё раз или выберите другой способ оплаты.
          </p>
        </>
      )}

      <div className="flex flex-col gap-3 items-center">
        {isFailed && (
          <Link href="/dashboard/billing/topup" className="pill pill-ink w-full justify-center">
            Попробовать снова
          </Link>
        )}
        <Link href="/dashboard/billing" className="pill pill-paper w-full justify-center">
          {isSuccess ? 'Перейти к балансу' : 'Отмена'}
        </Link>
      </div>
    </div>
  )
}
