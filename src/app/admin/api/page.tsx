'use client'
import { useCallback, useEffect, useState } from 'react'
import { Copy, Check, KeyRound, Plus, RefreshCw } from 'lucide-react'
import { adminReq, AdminApiError } from '@/lib/admin-api'

interface ApiClient {
  id: string
  name: string
  contact: string | null
  status: 'active' | 'suspended'
  key_prefix: string
  balance_usd: number
  rate_limit_per_min: number
  daily_limit_usd: number
  esim_markup: number | null
  spent_today_usd: number
  orders: number
  revenue_usd: number
  cost_usd: number
  created_at: string | null
  last_used_at: string | null
}

type Settings = Record<string, string>

const usd = (n: number) => `$${n.toFixed(2)}`
const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const errText = (e: unknown) => (e instanceof AdminApiError ? e.message : (e as Error).message)

function fmtWhen(iso: string | null) {
  if (!iso) return 'ещё не было'
  return new Date(iso).toLocaleString('ru', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onMouseDown={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}

/** The key is shown once; after this dialog closes it can only be replaced. */
function KeyReveal({ name, apiKey, onClose }: { name: string; apiKey: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(apiKey); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }
  return (
    <Modal title={`Ключ для «${name}»`} onClose={onClose}>
      <p className="text-sm text-gray-600">
        Покажу один раз: в базе хранится только отпечаток. Передайте ключ клиенту, потерянный ключ можно только заменить.
      </p>
      <div className="flex items-stretch gap-2">
        <code className="flex-1 min-w-0 break-all bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono select-all">{apiKey}</code>
        <button onClick={copy} className="px-3 border border-gray-300 rounded-lg hover:bg-gray-50" aria-label="Скопировать ключ">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
        Готово, ключ сохранён
      </button>
    </Modal>
  )
}

function CreateModal({ onCreated, onClose }: { onCreated: (c: ApiClient & { api_key: string }) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [rate, setRate] = useState('60')
  const [daily, setDaily] = useState('200')
  const [markup, setMarkup] = useState('')
  const [balance, setBalance] = useState('0')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const created = await adminReq<ApiClient & { api_key: string }>('/v1/admin/api-clients', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim() || null,
          rate_limit_per_min: parseInt(rate) || 60,
          daily_limit_usd: parseFloat(daily) || 0,
          esim_markup: markup.trim() ? parseFloat(markup) : null,
          initial_balance_usd: parseFloat(balance) || 0,
        }),
      })
      onCreated(created)
    } catch (e) { setError(errText(e)); setSaving(false) }
  }

  return (
    <Modal title="Новый клиент API" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Название"><input required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Например, TravelBot" /></Field>
        <Field label="Контакт" hint="Почта или Telegram, по желанию"><input value={contact} onChange={e => setContact(e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Запросов в минуту"><input type="number" min={1} value={rate} onChange={e => setRate(e.target.value)} className={inputCls} /></Field>
          <Field label="Лимит трат в сутки, $" hint="0 — без лимита"><input type="number" min={0} step="1" value={daily} onChange={e => setDaily(e.target.value)} className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Наценка eSIM, ×" hint="Пусто — общая"><input type="number" min={1} step="0.01" value={markup} onChange={e => setMarkup(e.target.value)} className={inputCls} placeholder="общая" /></Field>
          <Field label="Стартовый баланс, $"><input type="number" min={0} step="0.01" value={balance} onChange={e => setBalance(e.target.value)} className={inputCls} /></Field>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Отмена</button>
          <button type="submit" disabled={saving || !name.trim()} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Создаю…' : 'Создать и выдать ключ'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function EditModal({ client, onDone, onClose }: { client: ApiClient; onDone: () => void; onClose: () => void }) {
  const [name, setName] = useState(client.name)
  const [contact, setContact] = useState(client.contact ?? '')
  const [rate, setRate] = useState(String(client.rate_limit_per_min))
  const [daily, setDaily] = useState(String(client.daily_limit_usd))
  const [markup, setMarkup] = useState(client.esim_markup == null ? '' : String(client.esim_markup))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await adminReq(`/v1/admin/api-clients/${client.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          rate_limit_per_min: parseInt(rate) || 60,
          daily_limit_usd: parseFloat(daily) || 0,
          ...(markup.trim() ? { esim_markup: parseFloat(markup) } : { clear_esim_markup: true }),
        }),
      })
      onDone(); onClose()
    } catch (e) { setError(errText(e)); setSaving(false) }
  }

  return (
    <Modal title={`Настройки: ${client.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Название"><input required value={name} onChange={e => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Контакт"><input value={contact} onChange={e => setContact(e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Запросов в минуту"><input type="number" min={1} value={rate} onChange={e => setRate(e.target.value)} className={inputCls} /></Field>
          <Field label="Лимит трат в сутки, $" hint="0 — без лимита"><input type="number" min={0} step="1" value={daily} onChange={e => setDaily(e.target.value)} className={inputCls} /></Field>
        </div>
        <Field label="Наценка eSIM, ×" hint="Пусто — общая наценка API из блока выше"><input type="number" min={1} step="0.01" value={markup} onChange={e => setMarkup(e.target.value)} className={inputCls} placeholder="общая" /></Field>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Отмена</button>
          <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{saving ? 'Сохраняю…' : 'Сохранить'}</button>
        </div>
      </form>
    </Modal>
  )
}

function CreditModal({ client, onDone, onClose }: { client: ApiClient; onDone: () => void; onClose: () => void }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('Ручное пополнение')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value) return
    setSaving(true); setError('')
    try {
      await adminReq(`/v1/admin/api-clients/${client.id}/credit`, { method: 'POST', body: JSON.stringify({ amount_usd: value, note }) })
      onDone(); onClose()
    } catch (e) { setError(errText(e)); setSaving(false) }
  }

  return (
    <Modal title={`Баланс: ${client.name}`} onClose={onClose}>
      <p className="text-sm text-gray-600">Сейчас на балансе <span className="font-semibold">{usd(client.balance_usd)}</span>. Отрицательная сумма списывает.</p>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Сумма, $"><input type="number" step="0.01" autoFocus value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} /></Field>
        <Field label="Комментарий"><input value={note} onChange={e => setNote(e.target.value)} className={inputCls} /></Field>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Отмена</button>
          <button type="submit" disabled={saving || !parseFloat(amount)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{saving ? 'Провожу…' : 'Провести'}</button>
        </div>
      </form>
    </Modal>
  )
}

interface VpnTariff { months: number; total_usd: number }

function PricingCard({ settings, tariffs, onSaved }: { settings: Settings; tariffs: VpnTariff[]; onSaved: () => void }) {
  const factor = parseFloat(settings.api_vpn_factor ?? '0.8') || 0.8
  const [markup, setMarkup] = useState(settings.api_esim_markup ?? '1.5')
  // The price the API charges for each VPN plan: the saved one, else the storefront price x the fallback factor
  const [prices, setPrices] = useState<Record<number, string>>(() =>
    Object.fromEntries(tariffs.map(t => {
      const saved = parseFloat(settings[`api_vpn_price_${t.months}`] ?? '')
      return [t.months, String(saved > 0 ? saved : Math.round(t.total_usd * factor * 100) / 100)]
    })))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    const m = parseFloat(markup)
    if (isNaN(m) || m < 1) { setError('Наценка eSIM не может быть меньше 1'); return }
    const body: Record<string, string> = { api_esim_markup: String(m) }
    for (const t of tariffs) {
      const p = parseFloat(prices[t.months])
      if (isNaN(p) || p <= 0) { setError(`Укажите цену VPN на ${t.months} мес.`); return }
      body[`api_vpn_price_${t.months}`] = String(Math.round(p * 100) / 100)
    }
    setSaving(true); setError('')
    try {
      await adminReq('/v1/admin/settings', { method: 'PATCH', body: JSON.stringify(body) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
      onSaved()
    } catch (e) { setError(errText(e)) } finally { setSaving(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-bold mb-1">Цены для API-клиентов</h2>
      <p className="text-sm text-gray-500 mb-4">Действуют для всех клиентов, у кого нет своей наценки. Наценка на сайте — ×{settings.esim_markup ?? '1.5'} (её меняют на вкладке eSIM).</p>
      <div className="max-w-2xl space-y-5">
        <Field label="Наценка на eSIM, ×" hint="Цена клиенту = оптовая цена × это число">
          <input type="number" min={1} step="0.01" value={markup} onChange={e => setMarkup(e.target.value)} className={inputCls} />
        </Field>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Цена VPN по API, $</div>
          <p className="text-xs text-gray-500 mb-2">Цена продажи партнёру за каждый тариф. Должна быть ниже розницы на сайте.</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3 font-medium">Тариф</th>
                <th className="py-2 pr-3 font-medium text-right">Розница на сайте</th>
                <th className="py-2 pr-3 font-medium">Цена по API</th>
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
                        type="number" min={0} step="0.01" value={prices[t.months] ?? ''}
                        onChange={e => setPrices(v => ({ ...v, [t.months]: e.target.value }))}
                        className={`${inputCls} w-32`} aria-label={`Цена на ${t.months} мес.`}
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
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3 max-w-2xl">{error}</p>}
      <button onClick={save} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
        {saved ? 'Сохранено' : saving ? 'Сохраняю…' : 'Сохранить цены'}
      </button>
    </div>
  )
}

export default function AdminApi() {
  const [clients, setClients] = useState<ApiClient[]>([])
  const [settings, setSettings] = useState<Settings>({})
  const [tariffs, setTariffs] = useState<VpnTariff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<ApiClient | null>(null)
  const [crediting, setCrediting] = useState<ApiClient | null>(null)
  const [reveal, setReveal] = useState<{ name: string; key: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [list, s, tf] = await Promise.all([
        adminReq<ApiClient[]>('/v1/admin/api-clients'),
        adminReq<Settings>('/v1/admin/settings'),
        adminReq<VpnTariff[]>('/v1/admin/vpn-tariffs'),
      ])
      setClients(list); setSettings(s); setTariffs(tf)
    } catch (e) { setError(errText(e)) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleStatus(c: ApiClient) {
    const next = c.status === 'active' ? 'suspended' : 'active'
    if (next === 'suspended' && !confirm(`Приостановить «${c.name}»? Его запросы начнут получать отказ.`)) return
    try {
      await adminReq(`/v1/admin/api-clients/${c.id}`, { method: 'PATCH', body: JSON.stringify({ status: next }) })
      load()
    } catch (e) { setError(errText(e)) }
  }

  async function rotateKey(c: ApiClient) {
    if (!confirm(`Заменить ключ «${c.name}»? Старый ключ перестанет работать сразу.`)) return
    try {
      const r = await adminReq<ApiClient & { api_key: string }>(`/v1/admin/api-clients/${c.id}/rotate-key`, { method: 'POST' })
      setReveal({ name: c.name, key: r.api_key })
      load()
    } catch (e) { setError(errText(e)) }
  }

  const totals = clients.reduce(
    (a, c) => ({ balance: a.balance + c.balance_usd, revenue: a.revenue + c.revenue_usd, cost: a.cost + c.cost_usd }),
    { balance: 0, revenue: 0, cost: 0 },
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">API</h1>
          <p className="text-sm text-gray-500 mt-1">Партнёры, которые продают наши eSIM и VPN через свой код. Документация для них: <a href="https://imba.live/api" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">imba.live/api</a></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" aria-label="Обновить">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Новый клиент
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

      <PricingCard key={`${settings.api_esim_markup}|${settings.api_vpn_factor}|${tariffs.map(t => settings[`api_vpn_price_${t.months}`]).join(',')}`} settings={settings} tariffs={tariffs} onSaved={load} />

      <div className="flex gap-3 flex-wrap">
        {[
          ['Клиентов', String(clients.length)],
          ['Остатки на балансах', usd(totals.balance)],
          ['Продано на', usd(totals.revenue)],
          ['Себестоимость eSIM', usd(totals.cost)],
        ].map(([label, value]) => (
          <div key={label} className="px-4 py-2 rounded-xl text-sm border border-gray-200 bg-white">
            <span className="text-gray-500">{label}: </span><span className="font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Клиент</th>
                <th className="px-4 py-3">Ключ</th>
                <th className="px-4 py-3">Баланс</th>
                <th className="px-4 py-3">Лимиты</th>
                <th className="px-4 py-3">Наценка</th>
                <th className="px-4 py-3">Заказы</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && clients.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Загрузка…</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  <KeyRound className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  Клиентов API пока нет. Создайте первого: он получит ключ и сможет сразу смотреть каталог.
                </td></tr>
              ) : clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.contact || 'без контакта'} · был {fmtWhen(c.last_used_at)}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.key_prefix}…</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 tabular-nums">{usd(c.balance_usd)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>{c.rate_limit_per_min} запр./мин</div>
                    <div>{c.daily_limit_usd ? `${usd(c.spent_today_usd)} из ${usd(c.daily_limit_usd)} за сутки` : `${usd(c.spent_today_usd)} за сутки, без лимита`}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{c.esim_markup == null ? <span className="text-gray-500">общая</span> : `×${c.esim_markup}`}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>{c.orders} шт. на {usd(c.revenue_usd)}</div>
                    <div>себестоимость eSIM {usd(c.cost_usd)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.status === 'active' ? 'Активен' : 'Приостановлен'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => setCrediting(c)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">Баланс</button>
                      <button onClick={() => setEditing(c)} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Настройки</button>
                      <button onClick={() => rotateKey(c)} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Новый ключ</button>
                      <button onClick={() => toggleStatus(c)} className={`px-2 py-1 text-xs rounded-lg font-medium ${c.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                        {c.status === 'active' ? 'Приостановить' : 'Включить'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {creating && <CreateModal onClose={() => setCreating(false)} onCreated={c => { setCreating(false); setReveal({ name: c.name, key: c.api_key }); load() }} />}
      {editing && <EditModal client={editing} onClose={() => setEditing(null)} onDone={load} />}
      {crediting && <CreditModal client={crediting} onClose={() => setCrediting(null)} onDone={load} />}
      {reveal && <KeyReveal name={reveal.name} apiKey={reveal.key} onClose={() => setReveal(null)} />}
    </div>
  )
}
