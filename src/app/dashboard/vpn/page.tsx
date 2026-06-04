import { redirect } from 'next/navigation'
import { Copy } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

const PLAN: Record<string, string> = { basic: 'Базовый', pro: 'Про', unlimited: 'Безлимит' }

const SERVERS = [
  { city: 'Амстердам', flag: '🇳🇱', ping: 45 },
  { city: 'Франкфурт', flag: '🇩🇪', ping: 52 },
  { city: 'Лондон', flag: '🇬🇧', ping: 67 },
  { city: 'Варшава', flag: '🇵🇱', ping: 38 },
  { city: 'Стамбул', flag: '🇹🇷', ping: 89 },
  { city: 'Тбилиси', flag: '🇬🇪', ping: 110 },
]

export default async function VpnPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const vpns = await prisma.vpnSubscription.findMany({ where: { userId: user.id } })
  const active = vpns.find((v) => v.status === 'active')

  return (
    <div className="max-w-3xl fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display text-4xl mb-1">VPN</h1>
          <p className="font-semibold text-ink/60">Защищённое соединение</p>
        </div>
      </div>

      {active ? (
        <>
          <div className="panel mb-5" style={{ background: 'var(--green)' }}>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-ink animate-pulse" />
              <span className="display text-lg">VPN активен</span>
              <span className="chip bg-paper ml-auto">{PLAN[active.plan] ?? active.plan}</span>
            </div>
            <div className="text-xs font-bold text-ink/60 mt-3">Истекает {new Date(active.expiresAt).toLocaleDateString('ru-RU')}</div>
          </div>

          <div className="panel mb-5">
            <h3 className="display text-lg mb-3">🔑 WireGuard конфигурация</h3>
            <div className="bg-cream border-2 border-ink rounded-2xl p-4 font-mono text-xs font-semibold break-all relative">
              {active.serverKey}
              <button className="chip bg-paper absolute top-3 right-3 hover:bg-ink hover:text-paper transition-colors"><Copy className="w-3 h-3" /> Копировать</button>
            </div>
            <p className="text-xs font-semibold text-ink/50 mt-3">Вставь ключ в приложение WireGuard на своём устройстве</p>
          </div>

          <div className="panel">
            <h3 className="display text-lg mb-4">🌍 Серверы</h3>
            <div className="space-y-1">
              {SERVERS.map((s) => (
                <div key={s.city} className="flex items-center justify-between py-3 px-3 rounded-2xl border-2 border-transparent hover:border-ink hover:bg-cream cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.flag}</span>
                    <span className="font-extrabold text-sm">{s.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.ping < 60 ? 'bg-green-500' : s.ping < 100 ? 'bg-yellow-500' : 'bg-orange-500'}`} />
                    <span className="text-xs font-bold font-mono text-ink/60">{s.ping}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="panel text-center py-14">
          <div className="text-6xl mb-4">🛡️</div>
          <h3 className="display text-xl mb-2">VPN не подключён</h3>
          <p className="font-semibold text-ink/60 mb-6">Защити соединение и получи доступ к заблокированным сервисам</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="pill pill-ink">Про — $9.99/мес</button>
            <button className="pill pill-paper">Базовый — бесплатно</button>
          </div>
        </div>
      )}
    </div>
  )
}
