import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Zap, Smartphone, Wallet, Wifi } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { CopyButton } from '@/components/CopyButton'
import { AnimatedBalance } from '@/components/AnimatedBalance'
import type { VpnSubscription, VpnServer } from '@/lib/types'

const DEFAULT_SERVER_ID = 'c973f18c-36df-4926-b369-05ebc0604579'
const VPN_PRICE = '$4.99'

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
            <AnimatedBalance balance={user.balance} />
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

          {/* Happ subscription */}
          {active.server_key && (
            <div className="panel" style={{ background: 'var(--paper)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
                  Happ — подписка
                </div>
                <CopyButton text={active.server_key} />
              </div>
              <p className="text-sm font-mono break-all text-ink/70 select-all mb-3">
                {active.server_key}
              </p>
              <ol className="space-y-1 text-sm font-semibold text-ink/70 mb-3">
                <li>1. Скачай <strong>Happ</strong> (iOS / Android)</li>
                <li>2. Открой → «Добавить подписку» → вставь ссылку выше</li>
                <li>3. Подключись к серверу одним нажатием</li>
              </ol>
              <div className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>
                ⚠️ В настройках сервера в Happ обязательно отключи <strong>Mux</strong> — иначе VPN не будет работать.
              </div>
            </div>
          )}
        </>
      ) : (
        /* Not connected — single connect button */
        <div className="panel" style={{ background: 'var(--blue-100)' }}>
          <div className="flex items-center gap-5 mb-5">
            <LottieSticker name="lock" size={80} />
            <div>
              <div className="display text-2xl mb-1">VPN не подключён</div>
              <p className="font-semibold text-ink/60 text-sm">
                5 локаций · без лагов · без логов
              </p>
            </div>
          </div>
          <div className="rounded-2xl px-5 py-4 border-2 border-ink flex items-center justify-between mb-4" style={{ background: 'var(--paper)' }}>
            <span className="text-sm font-extrabold text-ink/60">Твой баланс</span>
            <AnimatedBalance balance={user.balance} className="display text-2xl" />
          </div>
          <form action={activateVpn}>
            <button className="pill pill-ink w-full justify-center text-base">
              <Wifi className="w-5 h-5" strokeWidth={2.5} />
              Подключить VPN — {VPN_PRICE}/мес
            </button>
          </form>
        </div>
      )}

      {/* Server cards — always shown */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">Серверы</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">
          {active ? 'Входят в подписку' : '5 локаций включены в тариф'}
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {servers.map((s) => {
            const vlessUri = s.host ? vlessMap[s.host] : undefined
            return (
              <div key={s.id} className="panel" style={{ background: 'var(--paper)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{s.flag}</span>
                  <div>
                    <div className="display text-lg leading-tight">{s.city}</div>
                    <div className="text-xs font-bold text-ink/40">{s.country}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {s.ping ? (
                    <span className="chip" style={{ background: 'var(--green-100)' }}>
                      <Zap className="w-3 h-3" strokeWidth={3} /> ~{s.ping} мс
                    </span>
                  ) : <span />}
                  {active && vlessUri ? (
                    <CopyButton text={vlessUri} label="v2box" className="pill pill-paper pill-sm text-xs" />
                  ) : (
                    <span className="text-xs font-bold text-ink/20">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
