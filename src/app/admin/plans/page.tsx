'use client'
import { useEffect, useState } from 'react'
import { getPlans, createPlan, updatePlan, AdminApiError, Plan } from '@/lib/admin-api'
import { Plus, Pencil, X, Check } from 'lucide-react'

const EMPTY_PLAN: Omit<Plan, 'plan_id'> = {
  name: '',
  slug: '',
  price_usd: 0,
  esim_slots: 1,
  vpn_included: false,
  card_slots: 0,
  period_days: 30,
  is_active: true,
  sort_order: 0,
}

function PlanModal({
  plan,
  onSave,
  onClose,
}: {
  plan: Partial<Plan> | null
  onSave: (data: Omit<Plan, 'plan_id'>) => Promise<void>
  onClose: () => void
}) {
  const isNew = !plan?.plan_id
  const [form, setForm] = useState<Omit<Plan, 'plan_id'>>(
    plan ? { ...EMPTY_PLAN, ...plan } : EMPTY_PLAN
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }))

  // Auto-generate slug from name
  const handleName = (v: string) => {
    set('name', v)
    if (isNew) set('slug', v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, node: React.ReactNode) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {node}
    </div>
  )

  const inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">{isNew ? 'Новый план' : `Редактировать: ${plan?.name}`}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Название', inp({ value: form.name, onChange: e => handleName(e.target.value), required: true, placeholder: 'Про' }))}
            {field('Slug', inp({ value: form.slug, onChange: e => set('slug', e.target.value), required: true, placeholder: 'pro' }))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field('Цена (USD)', inp({ type: 'number', min: 0, step: '0.01', value: form.price_usd, onChange: e => set('price_usd', parseFloat(e.target.value) || 0), required: true }))}
            {field('Период (дней)', inp({ type: 'number', min: 1, value: form.period_days, onChange: e => set('period_days', parseInt(e.target.value) || 30), required: true }))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {field('eSIM слотов', inp({ type: 'number', min: 0, value: form.esim_slots, onChange: e => set('esim_slots', parseInt(e.target.value) || 0) }))}
            {field('Карт слотов', inp({ type: 'number', min: 0, value: form.card_slots, onChange: e => set('card_slots', parseInt(e.target.value) || 0) }))}
            {field('Порядок', inp({ type: 'number', min: 0, value: form.sort_order, onChange: e => set('sort_order', parseInt(e.target.value) || 0) }))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Описание</label>
            <textarea
              value={(form as any).description || ''}
              onChange={e => set('description' as any, e.target.value)}
              rows={2}
              placeholder="Краткое описание плана..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.vpn_included} onChange={e => set('vpn_included', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium">VPN включён</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium">Активный</span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Отмена
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Сохраняю...' : isNew ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Plan> | null | 'new'>(null)

  const load = async () => {
    try { setPlans(await getPlans()) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (data: Omit<Plan, 'plan_id'>) => {
    if (editing === 'new') {
      await createPlan(data)
    } else if (editing && (editing as Plan).plan_id) {
      await updatePlan((editing as Plan).plan_id, data)
    }
    await load()
  }

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="max-w-6xl space-y-6">
      {editing !== null && (
        <PlanModal
          plan={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Планы подписки</h1>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Новый план
        </button>
      </div>

      <div className="grid gap-4">
        {plans.map((p) => (
          <div key={p.plan_id} className={`bg-white rounded-xl border p-5 flex items-center gap-4 ${!p.is_active ? 'opacity-50' : 'border-gray-200'}`}>
            <div className="flex-1 grid grid-cols-7 gap-4 items-center">
              <div className="col-span-2">
                <div className="font-bold text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500 font-mono">{p.slug}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">${p.price_usd?.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{p.period_days === 36500 ? 'навсегда' : `${p.period_days} дней`}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{p.esim_slots}</div>
                <div className="text-xs text-gray-500">eSIM</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{p.card_slots}</div>
                <div className="text-xs text-gray-500">Карт</div>
              </div>
              <div className="text-center">
                {p.vpn_included
                  ? <span className="text-green-600 font-bold text-sm">VPN ✓</span>
                  : <span className="text-gray-400 text-sm">VPN —</span>}
              </div>
              <div className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.is_active ? 'Активен' : 'Скрыт'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditing(p)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
