'use client'
import { useEffect, useState, useCallback } from 'react'
import { adminReq } from '@/lib/admin-api'

interface Location { code: string; name: string; type: number }
interface Package {
  package_code: string
  name: string
  location_code: string
  data_gb: number
  duration_days: number
  price_usd: number
  retail_price_usd: number
  speed: string
}
interface EsimOrder {
  iccid: string
  order_no: string
  esim_tran_no: string
  status: string
  smdp_status: string
  package_name: string
  location_code: string
  data_gb: number
  used_gb: number
  expired_time: string
  created_at: string
  qr_code: string
  activation_code: string
}

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  '1': { text: 'Активна', cls: 'bg-green-100 text-green-700' },
  '2': { text: 'Использована', cls: 'bg-gray-100 text-gray-500' },
  '3': { text: 'Истекла', cls: 'bg-red-100 text-red-600' },
  'GOT_RESOURCE': { text: 'Выдана', cls: 'bg-blue-100 text-blue-700' },
  'RELEASED': { text: 'Активирована', cls: 'bg-green-100 text-green-700' },
  'DELETED': { text: 'Удалена', cls: 'bg-red-100 text-red-600' },
}

function statusBadge(status: string) {
  const s = STATUS_LABEL[status] ?? { text: status, cls: 'bg-gray-100 text-gray-500' }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.text}</span>
}

export default function EsimAdminPage() {
  const [tab, setTab] = useState<'packages' | 'orders'>('packages')
  const [balance, setBalance] = useState<number | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [country, setCountry] = useState('')
  const [packages, setPackages] = useState<Package[]>([])
  const [orders, setOrders] = useState<EsimOrder[]>([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [ordersPage, setOrdersPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedQr, setSelectedQr] = useState<EsimOrder | null>(null)

  // Load balance + locations once
  useEffect(() => {
    adminReq<{ balance_usd: number }>('/v1/admin/esim/balance')
      .then(r => setBalance(r.balance_usd))
      .catch(() => {})
    adminReq<{ locations: Location[] }>('/v1/admin/esim/locations')
      .then(r => setLocations(r.locations.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {})
  }, [])

  const loadPackages = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await adminReq<{ packages: Package[]; count: number }>(
        `/v1/admin/esim/packages?country=${country}`
      )
      setPackages(r.packages)
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [country])

  const loadOrders = useCallback(async (page = 1) => {
    setLoading(true); setError('')
    try {
      const r = await adminReq<{ esims: EsimOrder[]; total: number; page: number }>(
        `/v1/admin/esim/orders?page=${page}&page_size=20`
      )
      setOrders(r.esims)
      setOrdersTotal(r.total)
      setOrdersPage(page)
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (tab === 'packages') loadPackages()
    else loadOrders()
  }, [tab, loadPackages, loadOrders])

  const margin = (p: Package) =>
    p.retail_price_usd > 0
      ? Math.round((1 - p.price_usd / p.retail_price_usd) * 100)
      : 0

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">eSIM Access</h1>
          <p className="text-sm text-gray-500">Управление пакетами и выданными SIM-картами</p>
        </div>
        <div className="flex items-center gap-3">
          {balance !== null && (
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-right">
              <div className="text-xs text-gray-400">Баланс аккаунта</div>
              <div className={`text-lg font-bold ${balance > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                ${balance.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['packages', 'orders'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'packages' ? 'Пакеты' : `Выданные SIM ${ordersTotal > 0 ? `(${ordersTotal})` : ''}`}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* PACKAGES TAB */}
      {tab === 'packages' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap">
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
            >
              <option value="">Все страны</option>
              {locations.map(l => (
                <option key={l.code} value={l.code}>{l.name} ({l.code})</option>
              ))}
            </select>
            <button
              onClick={loadPackages}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
            >
              {loading ? 'Загрузка…' : 'Найти'}
            </button>
            <span className="text-sm text-gray-400">{packages.length} пакетов</span>
          </div>

          {/* Package table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Название</th>
                    <th className="text-left px-4 py-3">Страна</th>
                    <th className="text-right px-4 py-3">Данные</th>
                    <th className="text-right px-4 py-3">Дней</th>
                    <th className="text-right px-4 py-3">Оптовая</th>
                    <th className="text-right px-4 py-3">Розница</th>
                    <th className="text-right px-4 py-3">Маржа</th>
                    <th className="text-left px-4 py-3">Скорость</th>
                    <th className="text-left px-4 py-3">Код</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {packages.map(p => (
                    <tr key={p.package_code} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500">{p.location_code}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">{p.data_gb} GB</td>
                      <td className="px-4 py-3 text-right text-gray-700">{p.duration_days}д</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">${p.price_usd.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-400">${p.retail_price_usd.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        {margin(p) > 0 && (
                          <span className={`font-semibold ${margin(p) >= 40 ? 'text-green-600' : margin(p) >= 20 ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {margin(p)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{p.speed}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.package_code}</td>
                    </tr>
                  ))}
                  {!loading && packages.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">Нет пакетов</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">ICCID</th>
                    <th className="text-left px-4 py-3">Пакет</th>
                    <th className="text-left px-4 py-3">Страна</th>
                    <th className="text-right px-4 py-3">Данные</th>
                    <th className="text-right px-4 py-3">Использовано</th>
                    <th className="text-left px-4 py-3">Статус</th>
                    <th className="text-left px-4 py-3">Истекает</th>
                    <th className="text-left px-4 py-3">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(e => (
                    <tr key={e.iccid || e.order_no} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.iccid || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{e.package_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{e.location_code || '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">{e.data_gb} GB</td>
                      <td className="px-4 py-3 text-right text-gray-500">{e.used_gb} GB</td>
                      <td className="px-4 py-3">{statusBadge(e.smdp_status || String(e.status))}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {e.expired_time ? new Date(e.expired_time).toLocaleDateString('ru') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {e.qr_code ? (
                          <button
                            onClick={() => setSelectedQr(e)}
                            className="text-xs text-blue-600 hover:underline"
                          >QR</button>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                  {!loading && orders.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">Нет выданных SIM</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {ordersTotal > 20 && (
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => loadOrders(ordersPage - 1)}
                disabled={ordersPage <= 1 || loading}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >←</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">
                {ordersPage} / {Math.ceil(ordersTotal / 20)}
              </span>
              <button
                onClick={() => loadOrders(ordersPage + 1)}
                disabled={ordersPage >= Math.ceil(ordersTotal / 20) || loading}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >→</button>
            </div>
          )}
        </div>
      )}

      {/* QR Modal */}
      {selectedQr && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedQr(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">QR-код активации</h3>
              <button onClick={() => setSelectedQr(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {selectedQr.qr_code && (
              <img src={selectedQr.qr_code} alt="QR" className="w-full rounded-xl border border-gray-100" />
            )}
            {selectedQr.activation_code && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Код активации (LPA)</div>
                <div className="font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 break-all select-all">
                  {selectedQr.activation_code}
                </div>
              </div>
            )}
            <div className="text-xs text-gray-400">ICCID: {selectedQr.iccid}</div>
          </div>
        </div>
      )}
    </div>
  )
}
