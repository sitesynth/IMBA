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
  total: number
  confirmed: number
  revenue_30d: number
  success_rate: number
}

interface ProvidersResponse {
  providers: ProviderStats[]
  active: { fiat: string; crypto: string }
}

function ProviderCard({
  p,
  onActivate,
  activating,
}: {
  p: ProviderStats
  onActivate: (slug: string) => void
  activating: boolean
}) {
  return (
    <div className={`bg-white border rounded-xl p-5 flex flex-col gap-3 transition ${
      p.is_active ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{p.icon}</span>
          <div>
            <div className="font-bold text-gray-900 text-sm">{p.display_name}</div>
            <div className="text-xs text-gray-400">{p.description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {p.is_active && (
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Активен
            </span>
          )}
          {!p.enabled && (
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              Не настроен
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {p.methods.map(m => (
          <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {m}
          </span>
        ))}
      </div>

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

      <div className="flex gap-2">
        <Link
          href={`/admin/transactions?provider=${p.slug}`}
          className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Транзакции →
        </Link>
        {!p.is_active && (
          <button
            onClick={() => onActivate(p.slug)}
            disabled={activating}
            className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition"
          >
            Сделать активным
          </button>
        )}
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const [data, setData] = useState<ProvidersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [error, setError] = useState('')

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
    setActivating(true)
    try {
      await adminReq(`/v1/admin/payments/providers/${slug}/activate`, { method: 'POST' })
      await load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setActivating(false)
    }
  }

  const fiat = data?.providers.filter(p => p.category === 'fiat') ?? []
  const crypto = data?.providers.filter(p => p.category === 'crypto') ?? []

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Платёжные системы</h1>
        <p className="text-sm text-gray-500">Управление провайдерами и A/B переключение</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading && <div className="text-sm text-gray-400">Загрузка…</div>}

      {data && (
        <>
          {/* Fiat */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Фиат</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Активен: {data.providers.find(p => p.category === 'fiat' && p.is_active)?.display_name ?? '—'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fiat.map(p => (
                <ProviderCard key={p.slug} p={p} onActivate={handleActivate} activating={activating} />
              ))}
            </div>
          </div>

          {/* Crypto */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Крипто</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                Активен: {data.providers.find(p => p.category === 'crypto' && p.is_active)?.display_name ?? '—'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crypto.map(p => (
                <ProviderCard key={p.slug} p={p} onActivate={handleActivate} activating={activating} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
