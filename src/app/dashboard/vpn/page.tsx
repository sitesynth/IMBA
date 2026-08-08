import { redirect } from 'next/navigation'
import { Wallet } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { AnimatedBalance } from '@/components/AnimatedBalance'
import { VpnServersPanel } from '@/components/VpnServersPanel'
import { VpnTariffGrid } from '@/components/VpnTariffGrid'
import { VpnPromoInput } from '@/components/VpnPromoInput'
import { SocialVerifyWrapper } from '@/components/SocialVerifyWrapper'
import { getLocale, getDateLocale } from '@/lib/i18n'
import { t } from '@/lib/t'
import type { VpnSubscription, VpnServer, VpnTariff } from '@/lib/types'

const DEFAULT_SERVER_ID = 'c973f18c-36df-4926-b369-05ebc0604579'

async function fetchVlessUris(subUrl: string): Promise<string[]> {
  try {
    const res = await fetch(subUrl, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'v2rayNG/1.8.0' },
    })
    if (!res.ok) return []
    const b64 = await res.text()
    const decoded = Buffer.from(b64.trim(), 'base64').toString('utf-8')
    return decoded.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('vless://'))
  } catch {
    return []
  }
}

function buildVlessMap(uris: string[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const uri of uris) {
    const atPart = uri.split('@')[1] || ''
    const host = atPart.split(':')[0] || atPart.split('?')[0]
    if (host) map[host] = uri
  }
  return map
}

export default async function VpnPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const locale = await getLocale()

  const [vpns, servers, tariffs] = await Promise.all([
    api.get<VpnSubscription[]>('/v1/me/vpn').catch(() => [] as VpnSubscription[]),
    api.get<VpnServer[]>('/v1/me/vpn/servers').catch(() => [] as VpnServer[]),
    api.get<VpnTariff[]>('/v1/me/vpn/tariffs').catch(() => [] as VpnTariff[]),
  ])

  const active = vpns.find((v) => v.status === 'active')
  const vlessUris = active?.server_key ? await fetchVlessUris(active.server_key) : []
  const vlessMap = buildVlessMap(vlessUris)

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const defaultServerId = servers[0]?.id ?? DEFAULT_SERVER_ID

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">VPN</h1>
          <p className="font-semibold text-ink/60">{t('vpn.subtitle', locale)}</p>
        </div>
        <div className="flex items-center gap-3">
          {active && (
            <span className="chip" style={{ background: 'var(--green)' }}>
              <span className="w-2 h-2 rounded-full bg-ink inline-block" /> {t('dash.active', locale)}
            </span>
          )}
          <span className="chip" style={{ background: 'var(--yellow)' }}>
            <Wallet className="w-3.5 h-3.5" strokeWidth={2.5} />
            <AnimatedBalance balance={user.balance} currency={user.currency} rates={rates} />
          </span>
        </div>
      </div>

      {active ? (
        <>
          {/* Active plan panel */}
          <div className="panel" style={{ background: 'var(--blue-100)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 mb-1">{t('vpn.plan', locale)}</div>
                <div className="display text-3xl">{t(active.plan === 'basic' ? 'vpn.plan_trial' : 'vpn.plan_pro', locale)}</div>
                {active.expires_at && (
                  <div className="text-xs font-semibold text-ink/60 mt-2">
                    {t('vpn.until', locale)} {new Date(active.expires_at).toLocaleDateString(getDateLocale(locale))}
                  </div>
                )}
              </div>
              <LottieSticker name="lock" size={84} className="hidden md:block" />
            </div>
            <VpnPromoInput locale={locale} />
          </div>

          {/* Renew/Upgrade — directly below plan panel */}
          <div>
            <h2 className="display text-2xl mb-3">
              {active.plan === 'pro' ? t('vpn.renew', locale) : t('vpn.upgrade_to_pro', locale)}
            </h2>
            <VpnTariffGrid
              tariffs={tariffs}
              serverId={active.server_id ?? defaultServerId}
              trialAvailable={false}
              balance={user.balance}
              activePlan={active.plan}
              currency={user.currency}
              rates={rates}
            />
          </div>

          <VpnServersPanel
            servers={servers}
            vlessMap={vlessMap}
            serverKey={active.server_key}
            hasActive={true}
            wdttLink={active.wdtt_link}
          />
        </>
      ) : (
        <>
          <div className="panel" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            <div className="flex items-center gap-5">
              <LottieSticker name="lock" size={80} />
              <div>
                <div className="display text-2xl mb-1">{t('vpn.not_connected', locale)}</div>
                <p className="font-semibold opacity-60 text-sm">{t('vpn.locations', locale)}</p>
              </div>
            </div>
            {!user.trial_activated && <SocialVerifyWrapper />}
          </div>

          <div>
            <h2 className="display text-2xl mb-3">{t('vpn.choose_plan', locale)}</h2>
            <VpnTariffGrid
              tariffs={tariffs}
              serverId={defaultServerId}
              trialAvailable={!user.trial_activated}
              balance={user.balance}
              currency={user.currency}
              rates={rates}
            />
          </div>

          <VpnServersPanel
            servers={servers}
            vlessMap={vlessMap}
            serverKey={null}
            hasActive={false}
            wdttLink={null}
          />
        </>
      )}
    </div>
  )
}
