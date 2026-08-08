'use client'
import { useEffect, useState } from 'react'
import { getAdminVpnTariffs, updateAdminVpnTariffs, AdminVpnTariff } from '@/lib/admin-api'

const BADGE_LABEL: Record<string, string> = {
  best_value: 'Лучшая цена',
  popular: 'Популярный',
}

function CurrencyCell({
  value,
  onChange,
  prefix,
}: {
  value: number
  onChange: (v: number) => void
  prefix: string
}) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw] = useState(String(value))

  useEffect(() => {
    if (!editing) setRaw(String(value))
  }, [value, editing])

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        step="0.01"
        min="0"
        value={raw}
        onChange={e => setRaw(e.target.value)}
        onBlur={() => {
          const n = parseFloat(raw)
          if (!isNaN(n) && n > 0) onChange(n)
          setEditing(false)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          if (e.key === 'Escape') { setEditing(false); setRaw(String(value)) }
        }}
        className="w-24 px-2 py-1 text-sm font-mono border border-blue-400 rounded focus:outline-none"
      />
    )
  }

  return (
    <button
      onClick={() => { setEditing(true); setRaw(String(value)) }}
      className="font-mono font-semibold text-sm hover:bg-blue-50 px-2 py-1 rounded transition-colors"
      title="Нажми чтобы редактировать"
    >
      {prefix}{value}
    </button>
  )
}

export default function AdminTariffsPage() {
  const [tariffs, setTariffs] = useState<AdminVpnTariff[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminVpnTariffs()
      .then(setTariffs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function updateTotal(months: number, field: 'total_rub' | 'total_usd' | 'total_eur', value: number) {
    setTariffs(prev => prev.map(t => {
      if (t.months !== months) return t
      const perMonth = { rub: 'price_rub', usd: 'price_usd', eur: 'price_eur' }[field.split('_')[1]] as keyof AdminVpnTariff
      return {
        ...t,
        [field]: value,
        [perMonth]: Math.round((value / months) * 100) / 100,
      }
    }))
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      const updated = await updateAdminVpnTariffs(
        tariffs.map(t => ({ months: t.months, total_rub: t.total_rub, total_usd: t.total_usd, total_eur: t.total_eur }))
      )
      setTariffs(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Тарифная сетка VPN</h1>
          <p className="text-sm text-gray-500 mt-1">
            Фиксированные розничные цены. Клик по цене — редактировать. Нажми «Сохранить» чтобы применить.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? 'Сохраняю…' : saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Загрузка…</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Срок</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Значок</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    ₽ / мес · итого
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    $ / мес · итого
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    € / мес · итого
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tariffs.map(t => (
                  <tr key={t.months} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {t.months === 1 ? '1 месяц' : t.months === 3 ? '3 месяца' : t.months === 6 ? '6 месяцев' : '12 месяцев'}
                    </td>
                    <td className="px-5 py-4">
                      {t.badge ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          t.badge === 'best_value' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {BADGE_LABEL[t.badge] ?? t.badge}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-gray-500 text-xs mb-0.5">
                        {Math.round(t.price_rub)} ₽/мес
                      </div>
                      <CurrencyCell
                        value={t.total_rub}
                        prefix=""
                        onChange={v => updateTotal(t.months, 'total_rub', v)}
                      />
                      <span className="text-gray-400 text-xs ml-1">₽</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-gray-500 text-xs mb-0.5">
                        ${t.price_usd.toFixed(2)}/мес
                      </div>
                      <CurrencyCell
                        value={t.total_usd}
                        prefix="$"
                        onChange={v => updateTotal(t.months, 'total_usd', v)}
                      />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-gray-500 text-xs mb-0.5">
                        €{t.price_eur.toFixed(2)}/мес
                      </div>
                      <CurrencyCell
                        value={t.total_eur}
                        prefix="€"
                        onChange={v => updateTotal(t.months, 'total_eur', v)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Цены фиксированные — не зависят от курса. Клик по сумме итого → вводи новое значение → Enter. Цена за месяц пересчитается автоматически.
          </div>
        </div>
      )}
    </div>
  )
}
