import { redirect } from 'next/navigation'
import { QrCode, RefreshCw } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { EsimShop } from '@/components/EsimShop'
import { getLocale, getDateLocale } from '@/lib/i18n'
import { t } from '@/lib/t'
import type { Esim, EsimCatalog } from '@/lib/types'

export default async function EsimPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const locale = await getLocale()

  const [esims, catalog] = await Promise.all([
    api.get<Esim[]>('/v1/me/esims').catch(() => [] as Esim[]),
    api.get<EsimCatalog>('/v1/me/esims/catalog').catch(() => ({} as EsimCatalog)),
  ])

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">{t('esim.title', locale)}</h1>
          <p className="font-semibold text-ink/60">{t('esim.subtitle', locale)}</p>
        </div>
        <span className="chip" style={{ background: 'var(--violet-100)' }}>
          {esims.length} {t('esim.active_count', locale)}
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
                      ? t('esim.status_active', locale)
                      : esim.status === 'expired'
                      ? t('esim.status_expired', locale)
                      : t('esim.status_processing', locale)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{esim.used_gb.toFixed(1)} {t('dash.gb', locale)}</span>
                  <span className="text-ink/50">{t('dash.of_gb', locale)} {esim.data_gb} {t('dash.gb', locale)}</span>
                </div>
                <div className="h-3 bg-paper border-2 border-ink rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-ink" style={{ width: `${usagePercent}%` }} />
                </div>

                {esim.expires_at && (
                  <div className="text-xs font-semibold text-ink/60 mb-4">
                    {t('esim.valid_until', locale)} {new Date(esim.expires_at).toLocaleDateString(getDateLocale(locale))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="pill pill-paper pill-sm">
                    <QrCode className="w-4 h-4" strokeWidth={2.5} /> {t('esim.qr', locale)}
                  </button>
                  <button className="pill pill-ink pill-sm">
                    <RefreshCw className="w-4 h-4" strokeWidth={2.5} /> {t('esim.renew', locale)}
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
            <div className="display text-2xl mb-1">{t('esim.empty', locale)}</div>
            <p className="font-semibold text-ink/60 text-sm">
              {t('esim.empty_desc', locale)}
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">{t('esim.buy', locale)}</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">Списание с баланса IMBA · {Object.keys(catalog).length} стран</p>
        <EsimShop catalog={catalog} userBalance={(user as any).balance ?? 0} />
      </div>
    </div>
  )
}
