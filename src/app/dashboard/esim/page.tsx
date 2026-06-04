import { redirect } from 'next/navigation'
import { Plus, QrCode } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

const STATUS: Record<string, { label: string; bg: string }> = {
  active: { label: 'Активен', bg: 'var(--green-100)' },
  expired: { label: 'Истёк', bg: '#EFEBE2' },
  pending: { label: 'Ожидание', bg: 'var(--yellow-100)' },
}

const FLAGS: Record<string, string> = { TR: '🇹🇷', DE: '🇩🇪', US: '🇺🇸', AE: '🇦🇪', TH: '🇹🇭', GE: '🇬🇪' }

export default async function EsimPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const esims = await prisma.esim.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })

  return (
    <div className="max-w-3xl fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display text-4xl mb-1">eSIM</h1>
          <p className="font-semibold text-ink/60">Управление SIM-профилями</p>
        </div>
        <button className="pill pill-ink pill-sm"><Plus className="w-4 h-4" strokeWidth={2.5} /> Купить</button>
      </div>

      {esims.length === 0 ? (
        <Empty />
      ) : (
        <div className="space-y-5">
          {esims.map((esim) => {
            const st = STATUS[esim.status] ?? STATUS.expired
            const pct = Math.min((esim.usedGb / esim.dataGb) * 100, 100)
            return (
              <div key={esim.id} className="panel" style={{ background: st.bg }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{FLAGS[esim.country] ?? '🌍'}</span>
                    <div>
                      <div className="display text-lg">{esim.label}</div>
                      <div className="text-xs font-mono font-semibold text-ink/50">{esim.iccid.slice(0, 18)}…</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="chip bg-paper">{st.label}</span>
                    <button className="chip bg-paper hover:bg-ink hover:text-paper transition-colors"><QrCode className="w-3.5 h-3.5" /> QR</button>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-ink/60">Использовано</span>
                  <span>{esim.usedGb} / {esim.dataGb} ГБ</span>
                </div>
                <div className="h-3 bg-paper border-2 border-ink rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-ink/50">
                  <span>Истекает {new Date(esim.expiresAt).toLocaleDateString('ru-RU')}</span>
                  <button className="underline underline-offset-2 hover:text-ink">Продлить</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="panel mt-6" style={{ background: 'var(--violet-100)' }}>
        <h3 className="display text-lg mb-3">Популярные направления</h3>
        <div className="flex flex-wrap gap-2">
          {['🇹🇷 Турция', '🇦🇪 ОАЭ', '🇩🇪 Германия', '🇹🇭 Таиланд', '🇬🇪 Грузия', '🇺🇸 США'].map((c) => (
            <button key={c} className="chip bg-paper hover:bg-ink hover:text-paper transition-colors">{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Empty() {
  return (
    <div className="panel text-center py-14">
      <div className="text-6xl mb-4">📶</div>
      <h3 className="display text-xl mb-2">Нет eSIM профилей</h3>
      <p className="font-semibold text-ink/60 mb-6">Купи первый eSIM для интернета в любой стране</p>
      <button className="pill pill-ink mx-auto">Купить eSIM →</button>
    </div>
  )
}
