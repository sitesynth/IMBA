'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminReq } from '@/lib/admin-api'

interface ProviderStats {
  slug: string
  display_name: string
  category: 'fiat' | 'crypto'
  icon: string
  description: string
  methods: string[]
  enabled: boolean
  is_active: boolean
  fallback_pos: number
  total: number
  confirmed: number
  revenue_30d: number
  success_rate: number
}

interface ProvidersResponse {
  providers: ProviderStats[]
  active: { fiat: string; crypto: string }
  fallback_order: { fiat: string[]; crypto: string[] }
}

function posLabel(pos: number) {
  if (pos === 0) return { text: 'Основной', cls: 'bg-blue-100 text-blue-700' }
  if (pos === 1) return { text: 'Резерв 1', cls: 'bg-amber-100 text-amber-700' }
  if (pos === 2) return { text: 'Резерв 2', cls: 'bg-gray-100 text-gray-600' }
  return { text: `Резерв ${pos}`, cls: 'bg-gray-100 text-gray-500' }
}

function ProviderCard({
  p,
  total,
  onMove,
  onActivate,
  busy,
  isFirst,
  isLast,
}: {
  p: ProviderStats
  total: number
  onMove: (slug: string, dir: -1 | 1) => void
  onActivate: (slug: string) => void
  busy: boolean
  isFirst: boolean
  isLast: boolean
}) {
  const pos = posLabel(p.fallback_pos)

  return (
    <div className={`bg-white border rounded-xl p-5 flex flex-col gap-3 transition ${
      p.is_active ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{p.icon}</span>
          <div>
            <div className="font-bold text-gray-900 text-sm">{p.display_name}</div>
            <div className="text-xs text-gray-400">{p.description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {p.enabled ? (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pos.cls}`}>
              {pos.text}
            </span>
          ) : (
            <span className="text-xs font-semibold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              Не настроен
            </span>
          )}
        </div>
      </div>

      {/* Methods */}
      <div className="flex gap-1 flex-wrap">
        {p.methods.map(m => (
          <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{m}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-3">
        <div>
          <div className="text-lg font-bold text-gray-900">{p.confirmed}</div>
          <div className="text-xs text-gray-400">Платежей</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">
            {p.revenue_30d.toLocaleString('ru', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-gray-400">Выручка 30д</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${
            p.success_rate >= 70 ? 'text-green-600' : p.success_rate >= 40 ? 'text-yellow-600' : 'text-gray-400'
          }`}>{p.success_rate}%</div>
          <div className="text-xs text-gray-400">Конверсия</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/admin/transactions?provider=${p.slug}`}
          className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Транзакции →
        </Link>

        {/* Reorder arrows */}
        {p.enabled && (
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => onMove(p.slug, -1)}
              disabled={busy || isFirst}
              title="Повысить приоритет"
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-xs"
            >↑</button>
            <button
              onClick={() => onMove(p.slug, 1)}
              disabled={busy || isLast}
              title="Понизить приоритет"
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-xs"
            >↓</button>
          </div>
        )}

        {!p.is_active && p.enabled && (
          <button
            onClick={() => onActivate(p.slug)}
            disabled={busy}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition"
          >
            Сделать основным
          </button>
        )}
      </div>
    </div>
  )
}

function CategorySection({
  title,
  category,
  providers,
  busy,
  onMove,
  onActivate,
}: {
  title: string
  category: 'fiat' | 'crypto'
  providers: ProviderStats[]
  busy: boolean
  onMove: (slug: string, dir: -1 | 1) => void
  onActivate: (slug: string) => void
}) {
  const active = providers.find(p => p.is_active)
  const enabledProviders = providers.filter(p => p.enabled)

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {active && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Активен: {active.display_name}
          </span>
        )}
        {enabledProviders.length > 1 && (
          <span className="text-xs text-gray-400">
            Автоматический резерв: {enabledProviders.slice(1).map(p => p.display_name).join(' → ')}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {providers.map((p, i) => {
          const enabledInCategory = providers.filter(x => x.enabled)
          const enabledIdx = enabledInCategory.indexOf(p)
          return (
            <ProviderCard
              key={p.slug}
              p={p}
              total={providers.length}
              onMove={onMove}
              onActivate={onActivate}
              busy={busy}
              isFirst={!p.enabled || enabledIdx === 0}
              isLast={!p.enabled || enabledIdx === enabledInCategory.length - 1}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const [data, setData] = useState<ProvidersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await adminReq<ProvidersResponse>('/v1/admin/payments/providers')
      setData(res)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleActivate(slug: string) {
    if (!data) return
    setBusy(true)
    try {
      // Make it primary by putting it first in the order for its category
      const p = data.providers.find(x => x.slug === slug)
      if (!p) return
      const cat = p.category
      const currentOrder = data.fallback_order[cat] ?? []
      const newOrder = [slug, ...currentOrder.filter(s => s !== slug)]
      await adminReq(`/v1/admin/payments/providers/order`, {
        method: 'POST',
        body: JSON.stringify({ [cat]: newOrder }),
      })
      setSaved('Сохранено')
      setTimeout(() => setSaved(''), 2000)
      await load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function handleMove(slug: string, dir: -1 | 1) {
    if (!data) return
    const p = data.providers.find(x => x.slug === slug)
    if (!p) return
    const cat = p.category
    const order = [...(data.fallback_order[cat] ?? [])]
    const idx = order.indexOf(slug)
    if (idx === -1) return
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= order.length) return
    ;[order[idx], order[newIdx]] = [order[newIdx], order[idx]]

    setBusy(true)
    try {
      await adminReq(`/v1/admin/payments/providers/order`, {
        method: 'POST',
        body: JSON.stringify({ [cat]: order }),
      })
      setSaved('Сохранено')
      setTimeout(() => setSaved(''), 2000)
      await load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const fiat = (data?.providers ?? []).filter(p => p.category === 'fiat')
    .sort((a, b) => a.fallback_pos - b.fallback_pos)
  const crypto = (data?.providers ?? []).filter(p => p.category === 'crypto')
    .sort((a, b) => a.fallback_pos - b.fallback_pos)

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Платёжные системы</h1>
          <p className="text-sm text-gray-500">
            Первый в списке — основной. Остальные — автоматический резерв при сбое.
          </p>
        </div>
        {saved && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">{saved}</span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {loading && <div className="text-sm text-gray-400">Загрузка…</div>}

      {data && (
        <>
          <CategorySection
            title="Фиат"
            category="fiat"
            providers={fiat}
            busy={busy}
            onMove={handleMove}
            onActivate={handleActivate}
          />
          <CategorySection
            title="Крипто"
            category="crypto"
            providers={crypto}
            busy={busy}
            onMove={handleMove}
            onActivate={handleActivate}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
            <div className="font-semibold text-blue-800 text-sm mb-1">Как работает автоматический резерв</div>
            <p className="text-sm text-blue-700">
              При создании платежа система сначала пробует основного провайдера.
              Если он недоступен или вернул ошибку — автоматически пробует резерв 1, затем резерв 2.
              Пользователь не замечает переключения.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
