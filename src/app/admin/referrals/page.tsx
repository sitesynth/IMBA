'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Share2, X, Copy, Check } from 'lucide-react'
import {
  getReferralPrograms, toggleReferralProgram, createReferralProgram,
  getReferralDefaults, updateReferralDefaults, getPendingPayoutRequests, maskWallet,
  AdminApiError, ReferralProgram, ReferralDefaults, ReferralPayout,
} from '@/lib/admin-api'

function refLink(code: string) {
  return `https://www.imba.live/?ref=${code}`
}

function CreateModal({
  programs, defaults, onClose, onCreated,
}: {
  programs: ReferralProgram[]
  defaults: ReferralDefaults
  onClose: () => void
  onCreated: (p: ReferralProgram) => void
}) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [contact, setContact] = useState('')
  const [uplineId, setUplineId] = useState('')
  const [l1, setL1] = useState(defaults.l1_pct)
  const [l2, setL2] = useState(defaults.l2_pct)
  const [l3, setL3] = useState(defaults.l3_pct)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setError('')
    if (!name.trim()) { setError('Укажите имя партнёра'); return }
    if (code.trim().length < 3) { setError('Код минимум 3 символа'); return }
    setSaving(true)
    try {
      const prog = await createReferralProgram({
        referral_code: code.trim().toLowerCase(),
        name: name.trim(),
        contact: contact.trim() || null,
        upline_id: uplineId || null,
        l1_pct: l1, l2_pct: l2, l3_pct: l3,
        note: note.trim() || null,
      })
      onCreated(prog)
      onClose()
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Новый партнёр</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Имя / канал *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Иван Блогер"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Код (a-z, 0-9, -) *</label>
              <input value={code}
                onChange={e => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="ivan123"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Контакт (TG, email)</label>
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="@ivan_blogger"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Аплайн (кто привёл этого партнёра)</label>
            <select value={uplineId} onChange={e => setUplineId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white select-arrow">
              <option value="">— нет аплайна (L1 без цепочки) —</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name || p.referral_code} (?ref={p.referral_code})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">L1 % (прямые)</label>
              <input type="number" min={0} max={100} step={0.5} value={l1} onChange={e => setL1(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">L2 % (аплайн)</label>
              <input type="number" min={0} max={100} step={0.5} value={l2} onChange={e => setL2(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">L3 % (аплайн аплайна)</label>
              <input type="number" min={0} max={100} step={0.5} value={l3} onChange={e => setL3(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Заметка</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Внутренняя заметка…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[60px]" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Отмена</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
            {saving ? 'Создаём…' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminReferrals() {
  const [programs, setPrograms] = useState<ReferralProgram[]>([])
  const [defaults, setDefaults] = useState<ReferralDefaults>({ l1_pct: 25, l2_pct: 10, l3_pct: 5 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [defMsg, setDefMsg] = useState('')
  const [defSaving, setDefSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [pendingPayouts, setPendingPayouts] = useState<ReferralPayout[]>([])

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [progs, defs, pending] = await Promise.all([
        getReferralPrograms(), getReferralDefaults(), getPendingPayoutRequests().catch(() => []),
      ])
      setPrograms(progs)
      setDefaults(defs)
      setPendingPayouts(pending)
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (programId: string) => {
    try {
      await toggleReferralProgram(programId)
      await fetchAll()
    } catch (e) {
      console.error(e)
    }
  }

  const saveDefaults = async () => {
    setDefSaving(true)
    setDefMsg('')
    try {
      const d = await updateReferralDefaults(defaults)
      setDefaults(d)
      setDefMsg('✓ Сохранено')
      setTimeout(() => setDefMsg(''), 2500)
    } catch (e) {
      setDefMsg(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setDefSaving(false)
    }
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  if (loading) return <div className="p-8">Loading...</div>

  const totalEarned = programs.reduce((sum, p) => sum + p.total_earned, 0)
  const totalReferrals = programs.reduce((sum, p) => sum + p.total_referrals, 0)
  const totalCompleted = programs.reduce((sum, p) => sum + p.completed, 0)
  const totalPending = programs.reduce((sum, p) => sum + p.pending_payout, 0)

  const filtered = search.trim()
    ? programs.filter(p =>
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        p.referral_code.toLowerCase().includes(search.toLowerCase()) ||
        (p.contact || '').toLowerCase().includes(search.toLowerCase()))
    : programs

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Share2 className="w-8 h-8" /> Referral Programs
        </h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">
          + Добавить
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold">{programs.length}</div>
          <div className="text-xs text-gray-500 mt-1">Всего программ</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold">{totalReferrals}</div>
          <div className="text-xs text-gray-500 mt-1">Total Referrals</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold">{totalCompleted}</div>
          <div className="text-xs text-gray-500 mt-1">Completed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">К выплате</div>
        </div>
      </div>

      {pendingPayouts.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-200">
            <h2 className="font-bold text-amber-900">Запросы на выплату ({pendingPayouts.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-100/50">
                <tr>
                  <th className="px-5 py-2 text-left text-xs font-semibold text-amber-800">Партнёр</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold text-amber-800">Сумма</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold text-amber-800">Кошелёк</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold text-amber-800">Период</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold text-amber-800">Запрошено</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold text-amber-800"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200">
                {pendingPayouts.map(p => (
                  <tr key={p.id}>
                    <td className="px-5 py-2.5 text-sm font-medium">{p.partner_name || p.referral_code}</td>
                    <td className="px-5 py-2.5 text-sm font-mono font-bold">${p.amount.toFixed(2)}</td>
                    <td className="px-5 py-2.5 text-xs font-mono text-gray-600">{maskWallet(p.wallet)}</td>
                    <td className="px-5 py-2.5 text-sm text-gray-600">{p.period === 'weekly' ? 'Неделя' : 'Месяц'}</td>
                    <td className="px-5 py-2.5 text-sm text-gray-600">{p.requested_at ? new Date(p.requested_at).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-2.5 text-sm">
                      <Link href={`/admin/referrals/${p.referral_id}`} className="text-blue-600 hover:underline font-semibold">
                        Подтвердить
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Базовые ставки комиссий</h2>
          <span className="text-xs text-gray-400">Применяются к новым партнёрам по умолчанию</span>
        </div>
        <div className="flex items-end gap-6 flex-wrap">
          {(['l1_pct', 'l2_pct', 'l3_pct'] as const).map((key, i) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                {['L1 — прямой партнёр', 'L2 — аплайн партнёра', 'L3 — аплайн аплайна'][i]}
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number" min={0} max={100} step={0.5}
                  value={defaults[key]}
                  onChange={e => setDefaults({ ...defaults, [key]: parseFloat(e.target.value) || 0 })}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <button onClick={saveDefaults} disabled={defSaving}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-semibold disabled:opacity-50">
              Сохранить дефолты
            </button>
            <div className={`text-xs min-h-[1rem] ${defMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>{defMsg}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени, коду, контакту…"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Партнёр</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Реф-ссылка</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Контакт</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Рефералов</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Earned</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">К выплате</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400 text-sm">Нет программ. Создайте первую.</td></tr>
              ) : filtered.map((prog) => (
                <tr key={prog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link href={`/admin/referrals/${prog.id}`} className="hover:underline">{prog.name || '—'}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-500 font-mono">?ref={prog.referral_code}</code>
                      <button onClick={() => copy(refLink(prog.referral_code), prog.id)}
                        className="text-gray-400 hover:text-gray-700">
                        {copied === prog.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prog.contact || '—'}</td>
                  <td className="px-6 py-4 text-sm font-bold">{prog.total_referrals}</td>
                  <td className="px-6 py-4 text-sm font-mono">${prog.total_earned.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-sm font-mono ${prog.pending_payout > 0 ? 'text-amber-600 font-bold' : 'text-gray-500'}`}>
                    ${prog.pending_payout.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={prog.is_active ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                      {prog.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <Link href={`/admin/referrals/${prog.id}`} className="text-blue-600 hover:underline">View</Link>
                      <button onClick={() => handleToggle(prog.id)} className="text-orange-600 hover:underline">
                        {prog.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">{error}</div>}

      {showCreate && (
        <CreateModal
          programs={programs}
          defaults={defaults}
          onClose={() => setShowCreate(false)}
          onCreated={(p) => setPrograms(prev => [p, ...prev])}
        />
      )}
    </div>
  )
}
