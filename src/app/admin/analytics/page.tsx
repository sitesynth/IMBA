'use client'
import { useEffect, useState } from 'react'
import {
  getGscStats, getMetricaStats, clearAnalyticsCache,
  GscData, MetricaData,
} from '@/lib/admin-api'

function MiniBar({ data, valueKey }: { data: Record<string, number | string>[]; valueKey: string }) {
  const max = Math.max(...data.map(r => r[valueKey] as number), 1)
  return (
    <div className="flex items-end gap-0.5 h-16 mt-2">
      {data.map(r => (
        <div
          key={r.date}
          className="flex-1 bg-blue-400 rounded-sm min-w-0"
          style={{ height: `${Math.max(2, ((r[valueKey] as number) / max) * 100)}%` }}
          title={`${r.date}: ${r[valueKey]}`}
        />
      ))}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-4">
      <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminAnalytics() {
  const [gsc, setGsc] = useState<GscData | null>(null)
  const [metrica, setMetrica] = useState<MetricaData | null>(null)
  const [gscError, setGscError] = useState('')
  const [metricaError, setMetricaError] = useState('')
  const [days, setDays] = useState(28)
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)

  async function load(d = days) {
    setLoading(true)
    setGscError('')
    setMetricaError('')
    await Promise.all([
      getGscStats(d).then(setGsc).catch(e => setGscError((e as Error).message)),
      getMetricaStats(d).then(setMetrica).catch(e => setMetricaError((e as Error).message)),
    ])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleClearCache() {
    setClearing(true)
    try {
      await clearAnalyticsCache()
      await load()
    } finally {
      setClearing(false)
    }
  }

  function handleDays(d: number) {
    setDays(d)
    load(d)
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[7, 28, 90].map(d => (
              <button key={d} onClick={() => handleDays(d)}
                className={`px-3 py-1.5 rounded text-sm font-medium ${days === d ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {d}d
              </button>
            ))}
          </div>
          <button onClick={handleClearCache} disabled={clearing || loading}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 disabled:opacity-50">
            {clearing ? 'Clearing…' : 'Clear cache'}
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400">Loading…</div>}

      {/* ------------------------------------------------------------------ */}
      {/* GSC */}
      {/* ------------------------------------------------------------------ */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Google Search Console
          {gsc?.cached && <span className="ml-2 text-xs text-gray-400 font-normal">(cached)</span>}
        </h2>

        {gscError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {gscError.includes('not configured')
              ? <>Нужно добавить env vars: <code className="font-mono">GOOGLE_SERVICE_ACCOUNT_JSON</code> и <code className="font-mono">GSC_SITE_URL</code></>
              : gscError}
          </div>
        ) : gsc ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <StatCard label="Clicks" value={gsc.summary.clicks.toLocaleString()} />
              <StatCard label="Impressions" value={gsc.summary.impressions.toLocaleString()} />
              <StatCard label="CTR" value={`${gsc.summary.ctr}%`} />
              <StatCard label="Avg position" value={gsc.summary.position} />
            </div>

            {gsc.by_date.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="text-xs font-medium text-gray-500 mb-1">Clicks by day</div>
                <MiniBar data={gsc.by_date as unknown as Record<string, number | string>[]} valueKey="clicks" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{gsc.by_date[0]?.date}</span>
                  <span>{gsc.by_date[gsc.by_date.length - 1]?.date}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top queries */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700">Top queries</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-4 py-2 text-left">Query</th>
                      <th className="px-4 py-2 text-right">Clicks</th>
                      <th className="px-4 py-2 text-right">Pos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {gsc.top_queries.map(r => (
                      <tr key={r.query} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800 truncate max-w-[180px]">{r.query}</td>
                        <td className="px-4 py-2 text-right font-mono text-gray-700">{r.clicks}</td>
                        <td className="px-4 py-2 text-right font-mono text-gray-500">{r.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top pages */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700">Top pages</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-4 py-2 text-left">Page</th>
                      <th className="px-4 py-2 text-right">Clicks</th>
                      <th className="px-4 py-2 text-right">Impr</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {gsc.top_pages.map(r => (
                      <tr key={r.page} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800 truncate max-w-[180px]">
                          {r.page?.replace(/^https?:\/\/[^/]+/, '') || '/'}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-gray-700">{r.clicks}</td>
                        <td className="px-4 py-2 text-right font-mono text-gray-500">{r.impressions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Yandex Metrica */}
      {/* ------------------------------------------------------------------ */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Яндекс.Метрика
          {metrica?.cached && <span className="ml-2 text-xs text-gray-400 font-normal">(cached)</span>}
        </h2>

        {metricaError ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
            {metricaError.includes('not configured')
              ? <>Нужно добавить env vars: <code className="font-mono">YANDEX_METRICA_COUNTER_ID</code> и <code className="font-mono">YANDEX_METRICA_TOKEN</code></>
              : metricaError}
          </div>
        ) : metrica ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <StatCard label="Визиты" value={metrica.summary.visits.toLocaleString('ru')} />
              <StatCard label="Просмотры" value={metrica.summary.pageviews.toLocaleString('ru')} />
              <StatCard label="Пользователи" value={metrica.summary.users.toLocaleString('ru')} />
              <StatCard label="Отказы" value={`${metrica.summary.bounce_rate}%`} />
            </div>

            {metrica.by_date.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="text-xs font-medium text-gray-500 mb-1">Визиты по дням</div>
                <MiniBar data={metrica.by_date as unknown as Record<string, number | string>[]} valueKey="visits" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{metrica.by_date[0]?.date}</span>
                  <span>{metrica.by_date[metrica.by_date.length - 1]?.date}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top pages */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700">Топ страниц</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-4 py-2 text-left">Страница</th>
                      <th className="px-4 py-2 text-right">Визиты</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {metrica.top_pages.map(r => (
                      <tr key={r.page} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800 truncate max-w-[220px]">
                          {r.page?.replace(/^https?:\/\/[^/]+/, '') || '/'}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-gray-700">{r.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sources */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700">Источники</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-4 py-2 text-left">Источник</th>
                      <th className="px-4 py-2 text-right">Визиты</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {metrica.sources.map(r => (
                      <tr key={r.source} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800">{r.source}</td>
                        <td className="px-4 py-2 text-right font-mono text-gray-700">{r.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
