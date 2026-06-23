import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { apiFetch } from '@/lib/api'

const DEFAULT_SERVER_ID = 'c973f18c-36df-4926-b369-05ebc0604579'

interface Props {
  searchParams: Promise<{ status?: string; provider?: string; after?: string }>
}

export default async function TopupResultPage({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const { status, after } = await searchParams
  const isSuccess = status === 'success'
  const isFailed = status === 'failed'

  if (!isSuccess && !isFailed) {
    redirect('/dashboard/billing')
  }

  // Auto-execute deferred action after successful payment
  let afterError: string | null = null
  if (isSuccess && after === 'activate_vpn') {
    try {
      await apiFetch('/v1/me/vpn/activate', {
        method: 'POST',
        body: JSON.stringify({ plan: 'pro', server_id: DEFAULT_SERVER_ID }),
      })
      revalidatePath('/dashboard/vpn')
    } catch (e: unknown) {
      afterError = e instanceof Error ? e.message : 'Ошибка активации'
    }
    if (!afterError) redirect('/dashboard/vpn')
  }

  const afterLabel: Record<string, string> = {
    activate_vpn: 'VPN',
  }
  const serviceName = after ? afterLabel[after] : null

  return (
    <div className="fade-up max-w-md mx-auto pt-8 pb-12 text-center">
      {isSuccess ? (
        <>
          <div className="text-6xl mb-6">✅</div>
          <h1 className="display text-3xl mb-2">Оплата прошла</h1>
          {afterError ? (
            <p className="text-ink/60 font-semibold mb-8">
              Средства зачислены, но при активации {serviceName} возникла ошибка: {afterError}
            </p>
          ) : (
            <p className="text-ink/60 font-semibold mb-8">
              {serviceName
                ? `Средства зачислены. ${serviceName} активируется…`
                : 'Средства зачислены на ваш баланс. Спасибо!'}
            </p>
          )}
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
        {isSuccess && afterError && after === 'activate_vpn' && (
          <Link href="/dashboard/vpn" className="pill pill-ink w-full justify-center">
            Активировать VPN вручную
          </Link>
        )}
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
