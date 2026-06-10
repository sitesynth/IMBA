'use client'
import { useEffect, useState } from 'react'
import {
  getSubscriptions, updateSubscription, getPlans,
  Subscription, Plan, AdminApiError,
} from '@/lib/admin-api'
import { RefreshCw, ChevronDown } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  active: 'Активна',
  expired: 'Истекла',
  cancelled: 'Отменена',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
}

function ExtendModal({
  sub,
  onDone,
  onClose,
}: {
  sub: Subscription
  onDone: () => void
  onClose: () => void
}) {
  const [days, setDays] = useState(30)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSubscription(sub.id, { extend_days: days })
      onDone()
      onClose()
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">Продлить подписку</h2>
        <p className="text-sm text-gray-600">{sub.email} · <span className="font-medium">{sub.plan_name}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Кол-во дней</label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={e => setDays(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Отмена</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Сохраняю...' : `+${days} дней`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PlanSelect({
  sub,
  plans,
  onDone,
}: {
  sub: Subscription
  plans: Plan[]
  onDone: () => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const changePlan = async (planId: string) => {
    if (planId === sub.plan_id) { setOpen(false); return }
    setSaving(true)
    try {
      await updateSubscription(sub.id, { plan_id: planId })
      onDone()
    } finally {
      setSaving(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={saving}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 disabled:opacity-50"
      >
        {sub.plan_name} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
          {plans.filter(p => p.is_active).map(p => (
            <button
              key={p.plan_id}
              onClick={() => changePlan(p.plan_id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${p.plan_id === sub.plan_id ? 'font-bold text-blue-600' : ''}`}
            >
              {p.name}
              <span className="text-xs text-gray-500 ml-1">${p.price_usd}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [extending, setExtending] = useState<Subscription | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [s, p] = await Promise.all([
        getSubscriptions({ status: statusFilter || undefined, limit: 200 }),
        getPlans(),
      ])
      setSubs(s)
      setPlans(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const toggleAutoRenew = async (sub: Subscription) => {
    await updateSubscription(sub.id, { auto_renew: !sub.auto_renew })
    await load()
  }

  const cancel = async (sub: Subscription) => {
    if (!confirm(`Отменить подписку ${sub.email}?`)) return
    await updateSubscription(sub.id, { status: 'cancelled' })
    await load()
  }

  const fmtDate = (s: string) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="max-w-7xl space-y-6">
      {extending && (
        <ExtendModal sub={extending} onDone={load} onClose={() => setExtending(null)} />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Подписки</h1>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="expired">Истекшие</option>
            <option value="cancelled">Отменённые</option>
          </select>
          <button onClick={load} disabled={loading} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3">
        {(['active', 'expired', 'cancelled'] as const).map(s => {
          const count = subs.filter(x => x.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${statusFilter === s ? STATUS_COLORS[s] + ' border-current' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {STATUS_LABELS[s]}: {subs.filter(x => x.status === s).length || (statusFilter === s ? '…' : 0)}
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Пользователь</th>
              <th className="px-4 py-3">План</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Начало</th>
              <th className="px-4 py-3">Истекает</th>
              <th className="px-4 py-3">Авто-продление</th>
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Загрузка...</td></tr>
            ) : subs.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Подписок не найдено</td></tr>
            ) : subs.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{sub.email}</div>
                  {sub.name && <div className="text-xs text-gray-500">{sub.name}</div>}
                </td>
                <td className="px-4 py-3">
                  <PlanSelect sub={sub} plans={plans} onDone={load} />
                  <div className="text-xs text-gray-500">${sub.price_usd}/мес</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[sub.status] ?? sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{fmtDate(sub.starts_at)}</td>
                <td className="px-4 py-3 text-gray-600">{fmtDate(sub.expires_at)}</td>
                <td className="px-4 py-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sub.auto_renew}
                      onChange={() => toggleAutoRenew(sub)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs text-gray-600">{sub.auto_renew ? 'Да' : 'Нет'}</span>
                  </label>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExtending(sub)}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                    >
                      Продлить
                    </button>
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => cancel(sub)}
                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
