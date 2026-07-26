'use client'
import { useEffect, useState } from 'react'
import { Copy, Check, Plus, ToggleLeft, ToggleRight, Tag, Loader2 } from 'lucide-react'
import {
  listPromocodes, createPromocode, togglePromocode, getReferralPrograms,
  type Promocode, type ReferralProgram,
} from '@/lib/admin-api'

function randomSuffix(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function AdminPromocodesPage() {
  const [codes, setCodes] = useState<Promocode[]>([])
  const [partners, setPartners] = useState<ReferralProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Form state
  const [prefix, setPrefix] = useState('VPN')
  const [days, setDays] = useState(30)
  const [count, setCount] = useState(1)
  const [maxUses, setMaxUses] = useState<number | ''>(1)
  const [validUntil, setValidUntil] = useState('')
  const [description, setDescription] = useState('')
  const [referralProgramId, setReferralProgramId] = useState('')
  const [lastBatch, setLastBatch] = useState<string[]>([])
  const [batchError, setBatchError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [promo, refs] = await Promise.all([listPromocodes(), getReferralPrograms()])
      setCodes(promo)
      setPartners(refs)
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function generate() {
    setGenerating(true)
    setBatchError('')
    setLastBatch([])
    const created: string[] = []
    for (let i = 0; i < count; i++) {
      const code = `${prefix.toUpperCase()}-${randomSuffix()}`
      try {
        await createPromocode({
          code,
          description: description || undefined,
          discount_type: 'vpn_trial',
          discount_value: days,
          max_uses: maxUses !== '' ? maxUses : null,
          valid_until: validUntil ? new Date(validUntil).toISOString() : null,
          referral_program_id: referralProgramId || null,
        })
        created.push(code)
      } catch (e: unknown) {
        setBatchError(`Ошибка при создании ${code}: ${(e as Error).message}`)
        break
      }
    }
    setLastBatch(created)
    setGenerating(false)
    await load()
  }

  async function toggle(id: string) {
    await togglePromocode(id)
    await load()
  }

  function copyCode(code: string) {
    const url = `https://imba.live/promo/${code}`
    navigator.clipboard.writeText(url)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  function copyAll() {
    const text = lastBatch.map(c => `https://imba.live/promo/${c}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied('__all__')
    setTimeout(() => setCopied(null), 1500)
  }

  const vpnCodes = codes.filter(c => c.discount_type === 'vpn_trial')
  const otherCodes = codes.filter(c => c.discount_type !== 'vpn_trial')

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center gap-3">
        <Tag className="w-7 h-7" />
        <h1 className="text-2xl font-bold">Промокоды</h1>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-lg">Создать VPN-промокоды</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Префикс</label>
            <input
              value={prefix}
              onChange={e => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              maxLength={10}
              placeholder="VPN"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Дней VPN</label>
            <input
              type="number" min={1} max={365}
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Кол-во кодов</label>
            <input
              type="number" min={1} max={500}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Юзеров на код</label>
            <input
              type="number" min={1}
              value={maxUses}
              onChange={e => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="∞"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Срок действия (до)</label>
            <input
              type="date"
              value={validUntil}
              onChange={e => setValidUntil(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Описание (необязательно)</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Для блоггера @username"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Привязать к рефералу (необязательно)</label>
            <select
              value={referralProgramId}
              onChange={e => setReferralProgramId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">— не привязывать —</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name || p.referral_code} (?ref={p.referral_code})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generate}
            disabled={generating || !prefix}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {generating ? `Создаём ${count}...` : `Сгенерировать ${count} ${count === 1 ? 'код' : 'кодов'}`}
          </button>
          <span className="text-xs text-gray-400">
            Формат: {prefix || 'PREFIX'}-XXXXXX · {days} дней VPN
            {maxUses !== '' ? ` · до ${maxUses} юз.` : ' · безлимит'}
            {referralProgramId ? ' · комиссия партнёру за редемпшн' : ''}
          </span>
        </div>

        {batchError && (
          <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{batchError}</div>
        )}

        {lastBatch.length > 0 && (
          <div className="border border-green-200 bg-green-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-green-800">✅ Создано {lastBatch.length} кодов</span>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900"
              >
                {copied === '__all__' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Скопировать все ссылки
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {lastBatch.map(code => (
                <div key={code} className="flex items-center justify-between bg-white rounded-lg px-3 py-1.5 border border-green-200">
                  <span className="font-mono text-sm font-bold">{code}</span>
                  <button onClick={() => copyCode(code)} className="text-gray-400 hover:text-gray-700 ml-2">
                    {copied === code ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VPN trial codes list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold">VPN Trial промокоды</h2>
          <span className="text-xs text-gray-400">{vpnCodes.length} шт.</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Загрузка...</div>
        ) : vpnCodes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Нет промокодов</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-5 py-2.5 text-left">Код</th>
                  <th className="px-5 py-2.5 text-left">Дней</th>
                  <th className="px-5 py-2.5 text-left">Использований</th>
                  <th className="px-5 py-2.5 text-left">Истекает</th>
                  <th className="px-5 py-2.5 text-left">Описание</th>
                  <th className="px-5 py-2.5 text-left">Реферал</th>
                  <th className="px-5 py-2.5 text-left">Статус</th>
                  <th className="px-5 py-2.5 text-left">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vpnCodes.map(p => (
                  <tr key={p.id} className={p.is_active ? '' : 'opacity-50'}>
                    <td className="px-5 py-3 font-mono font-bold">{p.code}</td>
                    <td className="px-5 py-3 font-bold">{p.discount_value}д</td>
                    <td className="px-5 py-3">
                      {p.current_uses}{p.max_uses ? `/${p.max_uses}` : ''}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {p.valid_until ? p.valid_until.slice(0, 10) : '∞'}
                    </td>
                    <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">{p.description || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{p.referral_partner_name || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold ${p.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                        {p.is_active ? 'Активен' : 'Выкл'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => copyCode(p.code)} title="Скопировать ссылку" className="text-gray-400 hover:text-gray-700">
                          {copied === p.code ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button onClick={() => toggle(p.id)} title={p.is_active ? 'Выключить' : 'Включить'} className="text-gray-400 hover:text-gray-700">
                          {p.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Other codes */}
      {otherCodes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-bold">Остальные промокоды (скидки)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-5 py-2.5 text-left">Код</th>
                  <th className="px-5 py-2.5 text-left">Тип</th>
                  <th className="px-5 py-2.5 text-left">Значение</th>
                  <th className="px-5 py-2.5 text-left">Использований</th>
                  <th className="px-5 py-2.5 text-left">Статус</th>
                  <th className="px-5 py-2.5 text-left">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {otherCodes.map(p => (
                  <tr key={p.id} className={p.is_active ? '' : 'opacity-50'}>
                    <td className="px-5 py-3 font-mono font-bold">{p.code}</td>
                    <td className="px-5 py-3 text-gray-500">{p.discount_type}</td>
                    <td className="px-5 py-3">{p.discount_type === 'percent' ? `${p.discount_value}%` : `$${p.discount_value}`}</td>
                    <td className="px-5 py-3">{p.current_uses}{p.max_uses ? `/${p.max_uses}` : ''}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold ${p.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                        {p.is_active ? 'Активен' : 'Выкл'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggle(p.id)} className="text-gray-400 hover:text-gray-700">
                        {p.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
