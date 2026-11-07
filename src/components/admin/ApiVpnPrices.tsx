'use client'
import { useEffect, useState } from 'react'
import { adminReq } from '@/lib/admin-api'

interface VpnTariff { months: number; total_usd: number }
type Settings = Record<string, string>

const usd = (n: number) => `$${n.toFixed(2)}`

/** The price the API sells each VPN plan for. Until one is saved the API charges the retail price x api_vpn_factor. */
export function ApiVpnPrices() {
  const [tariffs, setTariffs] = useState<VpnTariff[]>([])
  const [prices, setPrices] = useState<Record<number, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      adminReq<VpnTariff[]>('/v1/admin/vpn-tariffs'),
      adminReq<Settings>('/v1/admin/settings'),
    ]).then(([tf, s]) => {
      const factor = parseFloat(s.api_vpn_factor ?? '0.8') || 0.8
      setTariffs(tf)
      setPrices(Object.fromEntries(tf.map(t => {
        const set = parseFloat(s[`api_vpn_price_${t.months}`] ?? '')
        return [t.months, String(set > 0 ? set : Math.round(t.total_usd * factor * 100) / 100)]
      })))
      setLoaded(true)
    }).catch(() => setError('Не удалось загрузить тарифы'))
  }, [])

  async function save() {
    const body: Record<string, string> = {}
    for (const t of tariffs) {
      const p = parseFloat(prices[t.months])
      if (isNaN(p) || p <= 0) { setError(`Укажите цену на ${t.months} мес.`); return }
      body[`api_vpn_price_${t.months}`] = String(Math.round(p * 100) / 100)
    }
    setSaving(true); setError('')
    try {
      await adminReq('/v1/admin/settings', { method: 'PATCH', body: JSON.stringify(body) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError((e as Error).message || 'Не удалось сохранить')
    } finally { setSaving(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <h2 className="text-base font-bold text-gray-900 mb-1">Цена VPN-контракта в API</h2>
      <p className="text-xs text-gray-400 mb-3">Цена продажи партнёру за каждый тариф. Должна быть ниже розницы на сайте. Заказы по API списываются по этим ценам.</p>
      {loaded && (
        <div className="overflow-x-auto">
          <table className="w-full max-w-xl text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-gray-700 border-b-2 border-gray-200">
                <th className="py-2 pr-3 font-medium">Тариф</th>
                <th className="py-2 pr-3 font-medium text-right">Розница</th>
                <th className="py-2 pr-3 font-medium">Цена по API, $</th>
                <th className="py-2 font-medium text-right">Скидка</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map(t => {
                const p = parseFloat(prices[t.months])
                const off = isNaN(p) ? null : Math.round((1 - p / t.total_usd) * 100)
                const bad = off !== null && off <= 0
                return (
                  <tr key={t.months} className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium">{t.months} мес.</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-600">{usd(t.total_usd)}</td>
                    <td className="py-2 pr-3">
                      <input
                        type="number" min="0" step="0.01" value={prices[t.months] ?? ''}
                        onChange={e => setPrices(v => ({ ...v, [t.months]: e.target.value }))}
                        className="w-28 text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2" aria-label={`Цена на ${t.months} мес.`}
                      />
                    </td>
                    <td className={`py-2 text-right tabular-nums font-medium ${bad ? 'text-red-600' : 'text-green-700'}`}>
                      {off === null ? '' : bad ? 'не дешевле розницы' : `−${off}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <button onClick={save} disabled={saving || !loaded}
        className="mt-4 text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 transition">
        {saving ? 'Сохраняю…' : saved ? '✓ Сохранено' : 'Сохранить'}
      </button>
    </div>
  )
}
