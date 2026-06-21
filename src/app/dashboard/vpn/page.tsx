import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Shield, Zap, Smartphone, Wallet } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
import { CopyButton } from '@/components/CopyButton'
import { AnimatedBalance } from '@/components/AnimatedBalance'
import { V2boxBlock } from '@/components/V2boxBlock'
import type { VpnSubscription, VpnServer } from '@/lib/types'

async function activateVpn(formData: FormData) {
  'use server'
  const server_id = formData.get('server_id') as string
  const plan = (formData.get('plan') as string) || 'pro'
  try {
    await apiFetch('/v1/me/vpn/activate', {
      method: 'POST',
      body: JSON.stringify({ plan, server_id }),
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

  return (
    <div className="fade-up space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="display text-4xl md:text-5xl mb-1">VPN</h1>
          <p className="font-semibold text-ink/60">VLESS+Reality, без логов</p>
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
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 mb-1">
                  План
                </div>
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

          {active.server_key && (
            <>
              {/* Happ block */}
              <div className="panel" style={{ background: 'var(--paper)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
                  <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
                    Happ — ссылка подписки
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

              {/* v2box block */}
              <V2boxBlock subUrl={active.server_key} />
            </>
          )}
        </>
      ) : (
        <div className="panel" style={{ background: 'var(--blue-100)' }}>
          <div className="flex items-center gap-5 mb-5">
            <LottieSticker name="lock" size={80} />
            <div>
              <div className="display text-2xl mb-1">VPN не подключён</div>
              <p className="font-semibold text-ink/60 text-sm">
                Выбери сервер — $4.99 спишется с баланса автоматически.
              </p>
            </div>
          </div>

          {/* Balance callout before pay */}
          <div className="rounded-2xl px-5 py-4 border-2 border-ink flex items-center justify-between" style={{ background: 'var(--paper)' }}>
            <span className="text-sm font-extrabold text-ink/60">Твой баланс</span>
            <AnimatedBalance balance={user.balance} className="display text-2xl" />
          </div>
        </div>
      )}

      {/* Servers */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">
          {active ? 'Сервер' : 'Выбери сервер'}
        </h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">
          Ниже — серверы с самой низкой задержкой
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {servers.map((s) => (
            <form key={s.id} action={activateVpn} className="panel" style={{ background: 'var(--paper)' }}>
              <input type="hidden" name="server_id" value={s.id} />
              <input type="hidden" name="plan" value={active?.plan || 'pro'} />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{s.flag}</span>
                <div>
                  <div className="display text-base">{s.city}</div>
                  <div className="text-xs font-bold text-ink/50">{s.country}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="chip" style={{ background: 'var(--green-100)' }}>
                  <Zap className="w-3 h-3" strokeWidth={3} /> ~{s.ping} мс
                </span>
                <button className="pill pill-ink pill-sm">
                  <Shield className="w-4 h-4" strokeWidth={2.5} /> Выбрать
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
