import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { QrCode, RefreshCw } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import type { Esim, EsimCatalog } from '@/lib/types'

async function buyEsim(formData: FormData) {
  'use server'
  const country = formData.get('country') as string
  const data_gb = Number(formData.get('data_gb'))
  try {
    await apiFetch('/v1/me/esims', {
      method: 'POST',
      body: JSON.stringify({ country, data_gb, label: '' }),
    })
  } catch (e) {
    if (e instanceof ApiError) console.error('eSIM purchase failed:', e.message)
  }
  revalidatePath('/dashboard/esim')
  revalidatePath('/dashboard')
}

export default async function EsimPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const [esims, catalog] = await Promise.all([
    api.get<Esim[]>('/v1/me/esims').catch(() => [] as Esim[]),
    api.get<EsimCatalog>('/v1/me/esims/catalog').catch(() => ({} as EsimCatalog)),
  ])

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">Твои eSIM</h1>
          <p className="font-semibold text-ink/60">Мобильный интернет в 190+ странах</p>
        </div>
        <span className="chip" style={{ background: 'var(--violet-100)' }}>
          {esims.length} активных
        </span>
      </div>

      {esims.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {esims.map((esim) => {
            const usagePercent = Math.min((esim.used_gb / esim.data_gb) * 100, 100)
            const flag = catalog[esim.country]?.flag || '🌍'
            const countryName = catalog[esim.country]?.country || esim.country
            return (
              <div key={esim.id} className="panel" style={{ background: 'var(--violet-100)' }}>
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-4xl flex-shrink-0">{flag}</span>
                    <div className="min-w-0">
                      <div className="display text-xl truncate">{esim.label || countryName}</div>
                      <div className="text-xs font-bold text-ink/60 mt-0.5 truncate">
                        ICCID: {esim.iccid.slice(0, 14)}…
                      </div>
                    </div>
                  </div>
                  <span
                    className="chip flex-shrink-0"
                    style={{
                      background:
                        esim.status === 'active'
                          ? 'var(--green)'
                          : esim.status === 'expired'
                          ? 'var(--orange)'
                          : 'var(--paper)',
                    }}
                  >
                    {esim.status === 'active'
                      ? '● Активна'
                      : esim.status === 'expired'
                      ? 'Истекла'
                      : 'В обработке'}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{esim.used_gb.toFixed(1)} ГБ</span>
                  <span className="text-ink/50">из {esim.data_gb} ГБ</span>
                </div>
                <div className="h-3 bg-paper border-2 border-ink rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-ink" style={{ width: `${usagePercent}%` }} />
                </div>

                {esim.expires_at && (
                  <div className="text-xs font-semibold text-ink/60 mb-4">
                    Действует до: {new Date(esim.expires_at).toLocaleDateString('ru-RU')}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="pill pill-paper pill-sm">
                    <QrCode className="w-4 h-4" strokeWidth={2.5} /> QR-код
                  </button>
                  <button className="pill pill-ink pill-sm">
                    <RefreshCw className="w-4 h-4" strokeWidth={2.5} /> Продлить
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="panel flex items-center gap-5" style={{ background: 'var(--violet-100)' }}>
          <LottieSticker name="plane" size={80} />
          <div>
            <div className="display text-2xl mb-1">У тебя ещё нет eSIM</div>
            <p className="font-semibold text-ink/60 text-sm">
              Выбери страну ниже — активация по QR за минуту.
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">Купить eSIM</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">Списание происходит с баланса IMBA</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(catalog).map(([code, info]) => {
            const cheapest = Math.min(...Object.values(info.prices))
            return (
              <details key={code} className="panel group" style={{ background: 'var(--paper)' }}>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{info.flag}</span>
                    <div>
                      <div className="display text-base">{info.country}</div>
                      <div className="text-xs font-bold text-ink/50">от ${cheapest.toFixed(2)}</div>
                    </div>
                  </div>
                  <span className="text-xl font-black transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-4 pt-4 border-t-2 border-cream space-y-2">
                  {Object.entries(info.prices).map(([gb, price]) => (
                    <form key={gb} action={buyEsim} className="flex items-center justify-between gap-2">
                      <input type="hidden" name="country" value={code} />
                      <input type="hidden" name="data_gb" value={gb} />
                      <div className="text-sm font-extrabold">{gb} ГБ</div>
                      <button className="pill pill-ink pill-sm">${price.toFixed(2)}</button>
                    </form>
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </div>
  )
}
