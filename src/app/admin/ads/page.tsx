'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAds, setAdSpend, AdsData, AdRow } from '@/lib/admin-api'

const PERIODS = [
  { days: 7, label: '7 дней' },
  { days: 30, label: '30 дней' },
  { days: 90, label: '90 дней' },
  { days: 0, label: 'Всё время' },
]

type Group = 'tag' | 'source' | 'campaign'
const GROUPS: { id: Group; label: string }[] = [
  { id: 'tag', label: 'По метке' },
  { id: 'campaign', label: 'По кампании' },
  { id: 'source', label: 'По источнику' },
]

const BOTS = ['imba_live_bot', 'imba_run_bot']

interface Agg {
  key: string
  label: string
  tag: string | null // set only when grouped by tag; spend can be edited then
  starts: number
  registered: number
  buyers: number
  revenue: number
  spend: number | null
  buyersAll: number
  revenueAll: number
}

const usd = (n: number) => `$${n.toFixed(2)}`
const pct = (n: number | null) => (n == null ? '—' : `${n}%`)

function aggregate(rows: AdRow[], group: Group): Agg[] {
  const map = new Map<string, Agg>()
  for (const r of rows) {
    const organic = r.tag === ''
    const key = organic ? '' : group === 'tag' ? r.tag : group === 'source' ? (r.source ?? '—') : `${r.source ?? '—'} / ${r.campaign ?? '—'}`
    const label = organic ? 'Без метки (органика)' : key
    const a = map.get(key) ?? {
      key, label, tag: group === 'tag' && !organic ? r.tag : null,
      starts: 0, registered: 0, buyers: 0, revenue: 0, spend: null, buyersAll: 0, revenueAll: 0,
    }
    a.starts += r.starts
    a.registered += r.registered
    a.buyers += r.buyers
    a.revenue += r.revenue_usd
    a.buyersAll += r.buyers_all_time
    a.revenueAll += r.revenue_usd_all_time
    if (r.spend_usd != null) a.spend = (a.spend ?? 0) + r.spend_usd
    map.set(key, a)
  }
  return [...map.values()].sort((x, y) => (x.key === '' ? 1 : y.key === '' ? -1 : y.registered - x.registered || y.starts - x.starts))
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-xl font-bold text-gray-900 mt-0.5">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
    </div>
  )
}

function SpendCell({ tag, value, onSaved }: { tag: string; value: number | null; onSaved: () => void }) {
  const [text, setText] = useState(value == null ? '' : String(value))
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => { setText(value == null ? '' : String(value)) }, [value])

  async function save() {
    const n = Number(text.replace(',', '.'))
    if (text.trim() === '' || Number.isNaN(n) || n < 0) { setState('error'); return }
    if (n === value) return
    setState('saving')
    try {
      await setAdSpend(tag, n)
      setState('saved')
      onSaved()
      setTimeout(() => setState('idle'), 1500)
    } catch {
      setState('error')
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400 text-xs">$</span>
      <input
        value={text}
        inputMode="decimal"
        onChange={e => { setText(e.target.value); setState('idle') }}
        onBlur={save}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        placeholder="0"
        className={`w-20 text-sm border rounded px-2 py-1 tabular-nums ${state === 'error' ? 'border-red-400' : 'border-gray-200'}`}
      />
      <span className="text-xs w-4 text-green-600">{state === 'saved' ? '✓' : state === 'saving' ? '…' : ''}</span>
    </div>
  )
}

function LinkBuilder() {
  const [bot, setBot] = useState(BOTS[0])
  const [source, setSource] = useState('')
  const [campaign, setCampaign] = useState('')
  const [creative, setCreative] = useState('')
  const [copied, setCopied] = useState(false)

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const tag = ['ad', clean(source), clean(campaign), clean(creative)].filter((p, i) => i === 0 || p).join('_')
  const ready = clean(source) !== ''
  const tooLong = tag.length > 64
  const link = `https://t.me/${bot}?start=${tag}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard may be blocked; the link is selectable below */ }
  }

  const input = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">Ссылка для рекламы</h2>
      <p className="text-xs text-gray-500 mb-3">
        Формат метки: <code>ad_источник_кампания_креатив</code>. Внутри части допустимы только латиница, цифры и «-»;
        остальное заменится автоматически. Метка запоминается при первом заходе человека по ссылке.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <select value={bot} onChange={e => setBot(e.target.value)} className={input}>
          {BOTS.map(b => <option key={b} value={b}>@{b}</option>)}
        </select>
        <input value={source} onChange={e => setSource(e.target.value)} placeholder="источник: tgads" className={`${input} w-40`} />
        <input value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="кампания: oct" className={`${input} w-40`} />
        <input value={creative} onChange={e => setCreative(e.target.value)} placeholder="креатив: v2" className={`${input} w-40`} />
      </div>
      {ready ? (
        <div className="flex flex-wrap items-center gap-3">
          <code className="text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2 select-all break-all">{link}</code>
          <button onClick={copy} disabled={tooLong} className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {copied ? '✓ Скопировано' : 'Копировать'}
          </button>
          {tooLong && <span className="text-xs text-red-600">Метка длиннее 64 символов, Telegram её обрежет. Сократите части.</span>}
        </div>
      ) : (
        <div className="text-xs text-gray-400">Введите хотя бы источник.</div>
      )}
    </div>
  )
}

export default function AdminAds() {
  const [days, setDays] = useState(30)
  const [group, setGroup] = useState<Group>('tag')
  const [data, setData] = useState<AdsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true)
    setError('')
    try {
      setData(await getAds(days))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => { load() }, [load])

  const rows = useMemo(() => (data ? aggregate(data.rows, group) : []), [data, group])
  const t = data?.totals

  return (
    <div className="max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Реклама</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {PERIODS.map(p => (
            <button key={p.days} onClick={() => setDays(p.days)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${days === p.days ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Воронка Telegram-бота по рекламным меткам: нажали «Старт», завели аккаунт, оплатили через платёжку. Аккаунты, которым начисляли баланс вручную, не учитываются.
      </p>

      <LinkBuilder />

      {loading && <div className="text-center py-12 text-gray-500">Загрузка…</div>}
      {error && <div className="text-center py-8 text-red-600">{error}</div>}

      {data && t && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <Card label="Нажали «Старт»" value={String(t.starts)} hint="уникальных людей" />
            <Card label="Завели аккаунт" value={String(t.registered)} hint={t.starts ? `${Math.round(Math.min(100, (t.registered / t.starts) * 100))}% от нажавших` : undefined} />
            <Card label="Оплатили" value={String(t.buyers)} hint={t.registered ? `${Math.round((t.buyers / t.registered) * 100)}% от аккаунтов` : undefined} />
            <Card label="Выручка" value={usd(t.revenue_usd)} hint="через платёжки" />
            <Card label="Расходы на рекламу" value={usd(t.spend_usd)} hint="сумма по всем меткам" />
          </div>

          <p className="text-xs text-gray-500 mb-4">
            {data.tracking_since
              ? <>Нажатия «Старт» считаются с {new Date(data.tracking_since).toLocaleDateString('ru')}. У более старых меток аккаунтов может быть больше, чем нажатий, поэтому процент для них не показывается.</>
              : <>Журнал нажатий «Старт» только что включён: цифры по нажатиям появятся после первых заходов по ссылкам. Аккаунты и оплаты уже учтены по сохранённой метке.</>}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {GROUPS.map(g => (
                <button key={g.id} onClick={() => setGroup(g.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${group === g.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  {g.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400">Расходы вводятся по метке (режим «По метке»). CPA и ROI считаются по оплатившим за всё время.</span>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Метка', 'Старт', 'Аккаунтов', 'Старт → акк.', 'Оплатили', 'Акк. → оплата', 'Выручка', 'Расходы', 'CPA', 'ROI'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map(a => {
                  const startToReg = a.starts && a.registered <= a.starts ? Math.round((a.registered / a.starts) * 1000) / 10 : null
                  const regToBuy = a.registered ? Math.round((a.buyers / a.registered) * 1000) / 10 : null
                  const cpa = a.spend && a.buyersAll ? a.spend / a.buyersAll : null
                  const roi = a.spend ? Math.round(((a.revenueAll - a.spend) / a.spend) * 1000) / 10 : null
                  return (
                    <tr key={a.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {a.key === '' ? <span className="text-gray-500">{a.label}</span> : a.label}
                      </td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">{a.starts}</td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">{a.registered}</td>
                      <td className="px-4 py-3 text-gray-500 tabular-nums">{pct(startToReg)}</td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">{a.buyers}</td>
                      <td className="px-4 py-3 text-gray-500 tabular-nums">{pct(regToBuy)}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium tabular-nums">{usd(a.revenue)}</td>
                      <td className="px-4 py-3">
                        {a.tag ? <SpendCell tag={a.tag} value={a.spend} onSaved={() => load(true)} />
                          : <span className="text-gray-700 tabular-nums">{a.spend != null ? usd(a.spend) : '—'}</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">{cpa != null ? usd(cpa) : '—'}</td>
                      <td className={`px-4 py-3 tabular-nums font-medium ${roi == null ? 'text-gray-400' : roi >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {roi == null ? '—' : `${roi}%`}
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">Пока нет данных за этот период</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
