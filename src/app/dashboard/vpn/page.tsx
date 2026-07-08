import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Wallet, Wifi } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { AnimatedBalance } from '@/components/AnimatedBalance'
import { formatMoney } from '@/lib/format'
import { VpnServersPanel } from '@/components/VpnServersPanel'
import type { VpnSubscription, VpnServer } from '@/lib/types'

const DEFAULT_SERVER_ID = 'c973f18c-36df-4926-b369-05ebc0604579'
const VPN_PRICE_USD = 4.99

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

// Match VLESS URIs to servers by host IP — robust across city name translations
function buildVlessMap(uris: string[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const uri of uris) {
    // vless://UUID@HOST:PORT?...#remark
    const atPart = uri.split('@')[1] || ''
    const host = atPart.split(':')[0] || atPart.split('?')[0]
    if (host) map[host] = uri
  }
  return map
}

async function activateVpn() {
  'use server'
  try {
    await apiFetch('/v1/me/vpn/activate', {
      method: 'POST',
      body: JSON.stringify({ plan: 'pro', server_id: DEFAULT_SERVER_ID }),
    })
  } catch (e) {
    if (e instanceof ApiError) console.error('VPN activate failed:', e.message)
  }
  revalidatePath('/dashboard/vpn')
  revalidatePath('/dashboard')
}

export default async function VpnPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const [vpns, servers] = await Promise.all([
    api.get<VpnSubscription[]>('/v1/me/vpn').catch(() => [] as VpnSubscription[]),
    api.get<VpnServer[]>('/v1/me/vpn/servers').catch(() => [] as VpnServer[]),
  ])

  const active = vpns.find((v) => v.status === 'active')
  const vlessUris = active?.server_key ? await fetchVlessUris(active.server_key) : []
  const vlessMap = buildVlessMap(vlessUris)

  const rates = user.rates ?? { EUR: 0.92, RUB: 90 }
  const vpnPrice = formatMoney(VPN_PRICE_USD, user.currency, rates)
  const vpnIncluded = user.plan_slug === 'pro' || user.plan_slug === 'business'

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">VPN</h1>
          <p className="font-semibold text-ink/60">VPN на всех ваших устройствах без лагов и логов!</p>
        </div>
        <div className="flex items-center gap-3">
          {active && (
            <span className="chip" style={{ background: 'var(--green)' }}>
              <span className="w-2 h-2 rounded-full bg-ink inline-block" /> Активен
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
          {/* Plan info */}
          <div className="panel" style={{ background: 'var(--blue-100)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 mb-1">План</div>
                <div className="display text-3xl capitalize">{active.plan}</div>
                {active.expires_at && (
                  <div className="text-xs font-semibold text-ink/60 mt-2">
                    До: {new Date(active.expires_at).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
              <LottieSticker name="lock" size={84} className="hidden md:block" />
            </div>
          </div>

          <VpnServersPanel
            servers={servers}
            vlessMap={vlessMap}
            serverKey={active.server_key}
            hasActive={true}
          />
        </>
      ) : (
        /* Not connected — single connect button */
        <div className="panel" style={{ background: 'var(--blue-100)' }}>
          <div className="flex items-center gap-5 mb-5">
            <LottieSticker name="lock" size={80} />
            <div>
              <div className="display text-2xl mb-1">VPN не подключён</div>
              <p className="font-semibold text-ink/60 text-sm">
                {vpnIncluded
                  ? 'Входит в вашу подписку — активация бесплатна'
                  : '5 локаций · без лагов · без логов'}
              </p>
            </div>
          </div>
          {!vpnIncluded && (
            <div className="rounded-2xl px-5 py-4 border-2 border-ink flex items-center justify-between mb-4" style={{ background: 'var(--paper)' }}>
              <span className="text-sm font-extrabold text-ink/60">Твой баланс</span>
              <AnimatedBalance balance={user.balance} className="display text-2xl" />
            </div>
          )}
          {vpnIncluded ? (
            <form action={activateVpn}>
              <button className="pill pill-ink w-full justify-center text-base">
                <Wifi className="w-5 h-5" strokeWidth={2.5} />
                Активировать VPN
              </button>
            </form>
          ) : user.balance >= VPN_PRICE_USD ? (
            <form action={activateVpn}>
              <button className="pill pill-ink w-full justify-center text-base">
                <Wifi className="w-5 h-5" strokeWidth={2.5} />
                Подключить VPN — {vpnPrice}/мес
              </button>
            </form>
          ) : (
            <a href="/dashboard/billing/topup?after=activate_vpn" className="pill pill-ink w-full justify-center text-base">
              <Wallet className="w-5 h-5" strokeWidth={2.5} />
              Пополнить и подключить VPN — {vpnPrice}/мес
            </a>
          )}
        </div>
      )}

      {/* Server cards — shown only when not active (active state handled by VpnServersPanel above) */}
      {!active && (
        <VpnServersPanel
          servers={servers}
          vlessMap={vlessMap}
          serverKey={null}
          hasActive={false}
        />
      )}
    </div>
  )
}
