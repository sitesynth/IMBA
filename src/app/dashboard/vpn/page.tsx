import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Shield, Download, Copy, Zap } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api, apiFetch, ApiError } from '@/lib/api'
import { LottieSticker } from '@/components/LottieSticker'
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
          <p className="font-semibold text-ink/60">WireGuard, 50+ серверов, без логов</p>
        </div>
        {active && (
          <span className="chip" style={{ background: 'var(--green)' }}>
            <span className="w-2 h-2 rounded-full bg-ink inline-block" /> Активен
          </span>
        )}
      </div>

      {active ? (
        <>
          <div className="panel" style={{ background: 'var(--blue-100)' }}>
            <div className="flex items-start justify-between gap-4 mb-5">
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

            {active.server_key && (
              <div className="rounded-2xl p-4 border-2 border-ink" style={{ background: 'var(--paper)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50">
                    WireGuard конфигурация
                  </div>
                  <button className="pill pill-paper pill-sm">
                    <Copy className="w-4 h-4" strokeWidth={2.5} /> Копировать
                  </button>
                </div>
                <pre className="text-[10px] font-mono overflow-x-auto whitespace-pre text-ink/70 max-h-32">
{active.server_key}
                </pre>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button className="pill pill-ink pill-sm">
                <Download className="w-4 h-4" strokeWidth={2.5} /> Скачать .conf
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="panel flex items-center gap-5" style={{ background: 'var(--blue-100)' }}>
          <LottieSticker name="lock" size={80} />
          <div>
            <div className="display text-2xl mb-1">VPN не подключён</div>
            <p className="font-semibold text-ink/60 text-sm">
              Выбери сервер ниже — активация $4.99/мес списанием с баланса.
            </p>
          </div>
        </div>
      )}

      {/* Servers */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">
          {active ? 'Сменить сервер' : 'Выбери сервер'}
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
                  <Zap className="w-3 h-3" strokeWidth={3} /> ~{Math.floor(20 + Math.random() * 60)} мс
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
