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
interface HistoryItem {
  id: string
  user_email: string
  country: string
  label: string | null
  iccid: string
  data_gb: number
  used_gb: number
  status: string
  expires_at: string | null
  created_at: string | null
  provider: string
}

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  '1':            { text: 'Активна',      cls: 'bg-green-100 text-green-700' },
  '2':            { text: 'Использована', cls: 'bg-gray-100 text-gray-600' },
  '3':            { text: 'Истекла',      cls: 'bg-red-100 text-red-600' },
  'active':       { text: 'Активна',      cls: 'bg-green-100 text-green-700' },
  'expired':      { text: 'Истекла',      cls: 'bg-red-100 text-red-600' },
  'pending':      { text: 'Ожидает',      cls: 'bg-yellow-100 text-yellow-700' },
  'GOT_RESOURCE': { text: 'Выдана',       cls: 'bg-blue-100 text-blue-700' },
  'RELEASED':     { text: 'Активирована', cls: 'bg-green-100 text-green-700' },
  'DELETED':      { text: 'Удалена',      cls: 'bg-red-100 text-red-600' },
}

function statusBadge(status: string) {
  const s = STATUS_LABEL[status] ?? { text: status, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {s.text}
    </span>
  )
}

function EsimAccessOperator() {
  const [tab, setTab] = useState<'packages' | 'orders' | 'history'>('packages')
  const [balance, setBalance] = useState<number | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [country, setCountry] = useState('')
  const [packages, setPackages] = useState<Package[]>([])
  const [orders, setOrders] = useState<EsimOrder[]>([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [ordersPage, setOrdersPage] = useState(1)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyTotal, setHistoryTotal] = useState(0)
  const [historyPage, setHistoryPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedQr, setSelectedQr] = useState<EsimOrder | null>(null)
  const [markup, setMarkup] = useState<string>('1.5')
  const [markupSaving, setMarkupSaving] = useState(false)
  const [markupSaved, setMarkupSaved] = useState(false)

  // Load balance + locations + settings once
  useEffect(() => {
    adminReq<{ balance_usd: number }>('/v1/admin/esim/balance')
      .then(r => setBalance(r.balance_usd))
      .catch(() => {})
    adminReq<{ locations: Location[] }>('/v1/admin/esim/locations')
      .then(r => setLocations(r.locations.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {})
    adminReq<Record<string, string>>('/v1/admin/settings')
      .then(s => setMarkup(s.esim_markup ?? '1.5'))
      .catch(() => {})
  }, [])

  async function saveMarkup() {
    const val = parseFloat(markup)
    if (isNaN(val) || val < 1) return
    setMarkupSaving(true)
    try {
      await adminReq('/v1/admin/settings', { method: 'PATCH', body: JSON.stringify({ esim_markup: markup }), headers: { 'Content-Type': 'application/json' } })
      setMarkupSaved(true)
      setTimeout(() => setMarkupSaved(false), 2000)
    } finally {
      setMarkupSaving(false)
    }
  }

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

  const loadHistory = useCallback(async (page = 1) => {
    setLoading(true); setError('')
    try {
      const r = await adminReq<{ items: HistoryItem[]; total: number; page: number }>(
        `/v1/admin/esim/history?page=${page}&page_size=30`
      )
      setHistory(r.items)
      setHistoryTotal(r.total)
      setHistoryPage(page)
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (tab === 'packages') loadPackages()
    else if (tab === 'orders') loadOrders()
    else loadHistory()
  }, [tab, loadPackages, loadOrders, loadHistory])

  const margin = (p: Package) =>
    p.retail_price_usd > 0
      ? Math.round((1 - p.price_usd / p.retail_price_usd) * 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-600">Управление пакетами и выданными SIM-картами</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Markup setting */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">Наценка (×)</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.05"
                min="1"
                value={markup}
                onChange={e => setMarkup(e.target.value)}
                className="w-20 text-sm font-bold border border-gray-300 rounded-lg px-2 py-1"
              />
              <span className="text-xs font-semibold text-gray-600 tabular-nums">
                = +{Math.round((parseFloat(markup) - 1) * 100) || 0}%
              </span>
              <button
                onClick={saveMarkup}
                disabled={markupSaving}
                className="px-3.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 disabled:opacity-50 transition"
              >
                {markupSaved ? '✓' : 'Сохранить'}
              </button>
            </div>
          </div>

          {balance !== null && (
            <div className={`border rounded-xl shadow-sm px-4 py-3 text-right ${balance > 0 ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'}`}>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-600">Баланс аккаунта</div>
              <div className={`text-2xl font-extrabold tabular-nums leading-tight ${balance > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </div>
            </div>
          )}
          <a
            href="https://esimaccess.com/recharge"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition whitespace-nowrap"
          >
            + Пополнить
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-200/70 p-1 rounded-xl w-fit">
        {(['packages', 'orders', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
            }`}
          >
            {t === 'packages' ? 'Пакеты' :
             t === 'orders' ? `У провайдера${ordersTotal > 0 ? ` (${ordersTotal})` : ''}` :
             `История${historyTotal > 0 ? ` (${historyTotal})` : ''}`}
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
          <div className="flex gap-3 items-center flex-wrap">
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm"
            >
              <option value="">Все страны</option>
              {locations.map(l => (
                <option key={l.code} value={l.code}>{l.name} ({l.code})</option>
              ))}
            </select>
            <button
              onClick={loadPackages}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-700 disabled:opacity-50 transition"
            >
              {loading ? 'Загрузка…' : 'Найти'}
            </button>
            <span className="text-sm font-semibold text-gray-600 tabular-nums">{packages.length} пакетов</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wide">
                    <th className="text-left px-4 py-3.5">Название</th>
                    <th className="text-left px-4 py-3.5">Страна</th>
                    <th className="text-right px-4 py-3.5">Данные</th>
                    <th className="text-right px-4 py-3.5">Дней</th>
                    <th className="text-right px-4 py-3.5">Закупка</th>
                    <th className="text-right px-4 py-3.5">Продажа ×{markup}</th>
                    <th className="text-right px-4 py-3.5">Прибыль</th>
                    <th className="text-left px-4 py-3.5">Скорость</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map(p => {
                    const sellPrice = p.price_usd * parseFloat(markup)
                    const profit = sellPrice - p.price_usd
                    return (
                    <tr key={p.package_code} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 max-w-[260px] truncate" title={p.name}>{p.name}</td>
                      <td className="px-4 py-3"><span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700 tracking-wide">{p.location_code}</span></td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 tabular-nums">{p.data_gb} GB</td>
                      <td className="px-4 py-3 text-right text-gray-800 tabular-nums">{p.duration_days}д</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">${p.price_usd.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-700 tabular-nums">${sellPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-md bg-green-50 px-2 py-0.5 font-bold text-green-700 tabular-nums">+${profit.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-600">{p.speed}</td>
                    </tr>
                  )})}
                  {!loading && packages.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-medium text-sm">Нет пакетов</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB (eSIM Access provider list) */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wide">
                    <th className="text-left px-4 py-3.5">ICCID</th>
                    <th className="text-left px-4 py-3.5">Пакет</th>
                    <th className="text-left px-4 py-3.5">Страна</th>
                    <th className="text-right px-4 py-3.5">Данные</th>
                    <th className="text-right px-4 py-3.5">Использовано</th>
                    <th className="text-left px-4 py-3.5">Статус</th>
                    <th className="text-left px-4 py-3.5">Истекает</th>
                    <th className="text-left px-4 py-3.5">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(e => (
                    <tr key={e.iccid || e.order_no} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700 select-all">{e.iccid || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate" title={e.package_name}>{e.package_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">{e.location_code || '—'}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 tabular-nums">{e.data_gb} GB</td>
                      <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{e.used_gb} GB</td>
                      <td className="px-4 py-3">{statusBadge(e.smdp_status || String(e.status))}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 tabular-nums">
                        {e.expired_time ? new Date(e.expired_time).toLocaleDateString('ru') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {e.qr_code ? (
                          <button
                            onClick={() => setSelectedQr(e)}
                            className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                          >QR</button>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                  {!loading && orders.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-medium text-sm">Нет выданных SIM</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {ordersTotal > 20 && (
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => loadOrders(ordersPage - 1)}
                disabled={ordersPage <= 1 || loading}
                className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
              >←</button>
              <span className="px-3 py-2 text-sm font-semibold text-gray-600 tabular-nums">
                {ordersPage} / {Math.ceil(ordersTotal / 20)}
              </span>
              <button
                onClick={() => loadOrders(ordersPage + 1)}
                disabled={ordersPage >= Math.ceil(ordersTotal / 20) || loading}
                className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
              >→</button>
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB (our DB) */}
      {tab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wide">
                    <th className="text-left px-4 py-3.5">Дата</th>
                    <th className="text-left px-4 py-3.5">Пользователь</th>
                    <th className="text-left px-4 py-3.5">Страна</th>
                    <th className="text-right px-4 py-3.5">Данные</th>
                    <th className="text-right px-4 py-3.5">Использовано</th>
                    <th className="text-left px-4 py-3.5">Статус</th>
                    <th className="text-left px-4 py-3.5">Истекает</th>
                    <th className="text-left px-4 py-3.5">Провайдер</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map(h => (
                    <tr key={h.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap tabular-nums">
                        {h.created_at ? new Date(h.created_at).toLocaleString('ru', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium max-w-[220px] truncate text-sm" title={h.user_email}>{h.user_email}</td>
                      <td className="px-4 py-3"><span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700 tracking-wide">{h.country}</span></td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 tabular-nums">{h.data_gb} GB</td>
                      <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{h.used_gb} GB</td>
                      <td className="px-4 py-3">{statusBadge(h.status)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 tabular-nums">
                        {h.expires_at ? new Date(h.expires_at).toLocaleDateString('ru') : '—'}
                      </td>
                      <td className="px-4 py-3"><span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">{h.provider}</span></td>
                    </tr>
                  ))}
                  {!loading && history.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-medium text-sm">Нет покупок</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {historyTotal > 30 && (
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => loadHistory(historyPage - 1)}
                disabled={historyPage <= 1 || loading}
                className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
              >←</button>
              <span className="px-3 py-2 text-sm font-semibold text-gray-600 tabular-nums">
                {historyPage} / {Math.ceil(historyTotal / 30)}
              </span>
              <button
                onClick={() => loadHistory(historyPage + 1)}
                disabled={historyPage >= Math.ceil(historyTotal / 30) || loading}
                className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
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

// ───────────────────────── IMBA operator ─────────────────────────

interface ImbaStatus {
  configured: boolean
  live: boolean
  environment: 'test' | 'live'
  esim_variant: string
  client_name: string | null
  esim_limit: number | null
}
interface ImbaPlan {
  reference: string
  name: string
  type: 'data' | 'sms' | 'voice' | 'voice_sms'
  region: string
  data_mb: number | null
  sms_count: number | null
  voice_minutes: number | null
  validity_days: number | null
  recurring: boolean
}
interface ImbaEsim {
  profile_reference: string
  esim_reference: string | null
  iccid: string | null
  status: string | null
  lifecycle: string | null
  numbers: string[]
  created_at: string
}
interface ImbaOrderResult {
  ok: boolean
  iccid: string
  activation_code: string | null
  lpa: string | null
  status: string | null
  numbers: string[]
  profile_reference: string
}

const IMBA_TYPE: Record<ImbaPlan['type'], { text: string; cls: string }> = {
  data:      { text: 'Данные',    cls: 'bg-blue-100 text-blue-700' },
  sms:       { text: 'SMS',       cls: 'bg-amber-100 text-amber-700' },
  voice:     { text: 'Голос',     cls: 'bg-green-100 text-green-700' },
  voice_sms: { text: 'Голос+SMS', cls: 'bg-violet-100 text-violet-700' },
}

function imbaVolume(p: ImbaPlan) {
  const parts: string[] = []
  if (p.data_mb != null) parts.push(`${(p.data_mb / 1024).toFixed(1)} GB`)
  if (p.sms_count != null) parts.push(`${p.sms_count} SMS`)
  if (p.voice_minutes != null) parts.push(`${p.voice_minutes} мин`)
  return parts.length ? parts.join(' · ') : '—'
}

function lifecycleBadge(lifecycle: string | null, status: string | null) {
  const v = lifecycle ?? status
  if (!v) return <span className="text-gray-400">—</span>
  const k = v.toLowerCase()
  const cls = k === 'active' ? 'bg-green-100 text-green-700'
    : k === 'suspended' || k === 'terminated' ? 'bg-red-100 text-red-600'
    : 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {v}
    </span>
  )
}

function ImbaOperator() {
  const [sub, setSub] = useState<'plans' | 'esims'>('plans')
  const [status, setStatus] = useState<ImbaStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [regions, setRegions] = useState<{ code: string; name: string }[]>([])
  const [region, setRegion] = useState('')
  const [plans, setPlans] = useState<ImbaPlan[]>([])
  const [esims, setEsims] = useState<ImbaEsim[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ImbaOrderResult | null>(null)
  const [copied, setCopied] = useState(false)

  const configured = status?.configured === true

  useEffect(() => {
    adminReq<ImbaStatus>('/v1/admin/imba-esim/status')
      .then(setStatus)
      .catch(e => setError((e as Error).message))
      .finally(() => setStatusLoading(false))
  }, [])

  useEffect(() => {
    if (!configured) return
    adminReq<{ regions: { code: string; name: string }[] }>('/v1/admin/imba-esim/regions')
      .then(r => setRegions([...r.regions].sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {})
  }, [configured])

  const loadPlans = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await adminReq<{ plans: ImbaPlan[]; count: number }>(
        `/v1/admin/imba-esim/plans?region=${encodeURIComponent(region)}`
      )
      setPlans(r.plans)
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [region])

  const loadEsims = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await adminReq<{ items: ImbaEsim[]; has_more: boolean }>('/v1/admin/imba-esim/esims')
      setEsims(r.items)
      setHasMore(r.has_more)
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!configured) return
    if (sub === 'plans') loadPlans()
    else loadEsims()
  }, [configured, sub, loadPlans, loadEsims])

  async function orderPlan(p: ImbaPlan) {
    if (!confirm(`Заказать тестовую eSIM по тарифу «${p.name}»?`)) return
    setOrdering(true); setError(''); setResult(null); setCopied(false)
    try {
      const r = await adminReq<ImbaOrderResult>('/v1/admin/imba-esim/order', {
        method: 'POST',
        body: JSON.stringify({ plan_reference: p.reference }),
        headers: { 'Content-Type': 'application/json' },
      })
      setResult(r)
    } catch (e) { setError((e as Error).message) }
    finally { setOrdering(false) }
  }

  async function copyLpa(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  if (statusLoading) {
    return <div className="text-sm font-medium text-gray-500">Загрузка…</div>
  }

  return (
    <div className="space-y-6">
      {/* Status strip */}
      {status && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex items-center gap-4 flex-wrap">
          <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-extrabold tracking-wide ${
            status.environment === 'live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {status.environment === 'live' ? 'LIVE' : 'TEST'}
          </span>
          <span className="text-sm font-semibold text-gray-800">
            Оператор: IMBA eSIMs <span className="font-normal text-gray-600">(voice, SMS + data plans)</span>
          </span>
          <span className="text-sm text-gray-600">
            eSIM variant: <span className="font-mono font-semibold text-gray-800">{status.esim_variant}</span>
          </span>
          {status.client_name && (
            <span className="text-sm text-gray-600">Клиент: <span className="font-semibold text-gray-800">{status.client_name}</span></span>
          )}
          {status.esim_limit != null && (
            <span className="text-sm text-gray-600 tabular-nums">Лимит eSIM: <span className="font-semibold text-gray-800">{status.esim_limit}</span></span>
          )}
        </div>
      )}

      {status && !status.configured && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-semibold text-red-700">
          Оператор IMBA не настроен
        </div>
      )}

      {status?.configured && status.environment === 'test' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm font-medium text-amber-800">
          Тестовая среда: eSIM синтетические, на телефон не устанавливаются
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex justify-between">
          {error}
          <button onClick={() => setError('')} aria-label="Закрыть" className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {configured && (
        <>
          {/* Sub tabs */}
          <div className="flex gap-1 bg-gray-200/70 p-1 rounded-xl w-fit">
            {(['plans', 'esims'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSub(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                  sub === t ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                }`}
              >
                {t === 'plans' ? 'Тарифы' : 'Выданные eSIM'}
              </button>
            ))}
          </div>

          {/* Order result */}
          {result && (
            <div className="bg-white border border-green-200 rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">eSIM заказана</h3>
                <button onClick={() => setResult(null)} aria-label="Закрыть" className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-gray-600">ICCID</dt>
                  <dd className="font-mono text-xs text-gray-800 select-all">{result.iccid || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-gray-600">Статус</dt>
                  <dd>{result.status ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-gray-600">Номера</dt>
                  <dd className="font-mono text-xs text-gray-800 tabular-nums">{result.numbers.length ? result.numbers.join(', ') : '—'}</dd>
                </div>
              </dl>
              {(result.lpa ?? result.activation_code) && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">LPA</div>
                  <div className="flex items-start gap-2">
                    <div className="flex-1 font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 break-all select-all">
                      {result.lpa ?? result.activation_code}
                    </div>
                    <button
                      onClick={() => copyLpa((result.lpa ?? result.activation_code) as string)}
                      className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      {copied ? '✓ Скопировано' : 'Копировать'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PLANS */}
          {sub === 'plans' && (
            <div className="space-y-4">
              <div className="flex gap-3 items-center flex-wrap">
                <label htmlFor="imba-region" className="sr-only">Регион</label>
                <select
                  id="imba-region"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm"
                >
                  <option value="">Все регионы</option>
                  {regions.map(r => (
                    <option key={r.code} value={r.code}>{r.name} ({r.code})</option>
                  ))}
                </select>
                <button
                  onClick={loadPlans}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Загрузка…' : 'Найти'}
                </button>
                <span className="text-sm font-semibold text-gray-600 tabular-nums">{plans.length} тарифов</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wide">
                        <th className="text-left px-4 py-3.5">Тип</th>
                        <th className="text-left px-4 py-3.5">Название</th>
                        <th className="text-left px-4 py-3.5">Регион</th>
                        <th className="text-right px-4 py-3.5">Объём</th>
                        <th className="text-right px-4 py-3.5">Срок</th>
                        <th className="text-center px-4 py-3.5">Продление</th>
                        <th className="px-4 py-3.5"><span className="sr-only">Действия</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {plans.map(p => {
                        const t = IMBA_TYPE[p.type] ?? { text: p.type, cls: 'bg-gray-100 text-gray-600' }
                        return (
                          <tr key={p.reference} className="hover:bg-blue-50/40 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${t.cls}`}>{t.text}</span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900 max-w-[260px] truncate" title={p.name}>{p.name}</td>
                            <td className="px-4 py-3"><span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700 tracking-wide">{p.region}</span></td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 tabular-nums">{imbaVolume(p)}</td>
                            <td className="px-4 py-3 text-right text-gray-800 tabular-nums">{p.validity_days != null ? `${p.validity_days}д` : '∞'}</td>
                            <td className="px-4 py-3 text-center font-bold text-green-700">{p.recurring ? '✓' : ''}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => orderPlan(p)}
                                disabled={ordering || loading}
                                className="px-3.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 disabled:opacity-50 transition whitespace-nowrap"
                              >
                                Заказать тест
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                      {!loading && plans.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 font-medium text-sm">Нет тарифов</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ESIMS */}
          {sub === 'esims' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wide">
                        <th className="text-left px-4 py-3.5">ICCID</th>
                        <th className="text-left px-4 py-3.5">Статус</th>
                        <th className="text-left px-4 py-3.5">Номера</th>
                        <th className="text-left px-4 py-3.5">Создана</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {esims.map(e => (
                        <tr key={e.profile_reference} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700 select-all">{e.iccid || '—'}</td>
                          <td className="px-4 py-3">{lifecycleBadge(e.lifecycle, e.status)}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-700 tabular-nums">{e.numbers.length ? e.numbers.join(', ') : '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap tabular-nums">
                            {e.created_at ? new Date(e.created_at).toLocaleString('ru', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                        </tr>
                      ))}
                      {loading && esims.length === 0 && (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium text-sm">Загрузка…</td></tr>
                      )}
                      {!loading && esims.length === 0 && (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium text-sm">Нет выданных eSIM</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {hasMore && (
                <div className="flex justify-end">
                  <button
                    onClick={loadEsims}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
                  >
                    {loading ? 'Загрузка…' : 'Загрузить ещё'}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ───────────────────────── Page ─────────────────────────

export default function EsimAdminPage() {
  const [operator, setOperator] = useState<'esimaccess' | 'imba'>('esimaccess')

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">eSIMs</h1>

      <div className="flex gap-1 bg-gray-200/70 p-1 rounded-xl w-fit" role="group" aria-label="Оператор">
        {([['esimaccess', 'eSIM Access'], ['imba', 'IMBA eSIMs']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setOperator(key)}
            aria-pressed={operator === key}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              operator === key ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {operator === 'esimaccess' ? <EsimAccessOperator /> : <ImbaOperator />}
    </div>
  )
}
