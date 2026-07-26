'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users, X, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import {
  getReferralPrograms, getReferralConversions, updateReferralProgram,
  recordReferralPayout, getReferralPayouts, confirmReferralPayout, generatePartnerSetupLink, maskWallet,
  AdminApiError, ReferralProgram, ReferralConversion, ReferralPayout,
} from '@/lib/admin-api'

function tronscanLink(hash: string) {
  return `https://tronscan.org/#/transaction/${hash}`
}

function refLink(code: string) {
  return `https://www.imba.live/?ref=${code}`
}

function EditModal({
  program, programs, onClose, onSaved,
}: {
  program: ReferralProgram
  programs: ReferralProgram[]
  onClose: () => void
  onSaved: (p: ReferralProgram) => void
}) {
  const [name, setName] = useState(program.name || '')
  const [contact, setContact] = useState(program.contact || '')
  const [uplineId, setUplineId] = useState(program.upline_id || '')
  const [l1, setL1] = useState(program.l1_pct)
  const [l2, setL2] = useState(program.l2_pct)
  const [l3, setL3] = useState(program.l3_pct)
  const [note, setNote] = useState(program.note || '')
  const [promoLimit, setPromoLimit] = useState(program.promo_max_active_codes?.toString() || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await updateReferralProgram(program.id, {
        name: name.trim() || null,
        contact: contact.trim() || null,
        upline_id: uplineId || null,
        l1_pct: l1, l2_pct: l2, l3_pct: l3,
        note: note.trim() || null,
        promo_max_active_codes: promoLimit ? parseInt(promoLimit) : 0,
      })
      onSaved(updated)
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
          <h2 className="text-lg font-bold">Редактировать партнёра</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Имя / канал</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Контакт</label>
              <input value={contact} onChange={e => setContact(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Аплайн</label>
            <select value={uplineId} onChange={e => setUplineId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">— нет аплайна —</option>
              {programs.filter(p => p.id !== program.id).map(p => (
                <option key={p.id} value={p.id}>{p.name || p.referral_code} (?ref={p.referral_code})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">L1 %</label>
              <input type="number" min={0} max={100} step={0.5} value={l1} onChange={e => setL1(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">L2 %</label>
              <input type="number" min={0} max={100} step={0.5} value={l2} onChange={e => setL2(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">L3 %</label>
              <input type="number" min={0} max={100} step={0.5} value={l3} onChange={e => setL3(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Лимит своих промокодов (пусто = общий лимит)</label>
            <input type="number" min={1} value={promoLimit} onChange={e => setPromoLimit(e.target.value)}
              placeholder="по умолчанию" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Заметка</label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[60px]" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Отмена</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PayoutModal({
  program, onClose, onSaved,
}: {
  program: ReferralProgram
  onClose: () => void
  onSaved: (totalPaid: number) => void
}) {
  const [amount, setAmount] = useState(program.pending_payout > 0 ? program.pending_payout.toFixed(2) : '')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) { setError('Укажите сумму'); return }
    setSaving(true)
    setError('')
    try {
      const r = await recordReferralPayout(program.id, val, txHash.trim() || undefined)
      onSaved(r.total_paid)
      onClose()
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Зафиксировать выплату</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-gray-600">К выплате: <strong>${program.pending_payout.toFixed(2)}</strong></p>
          {program.payout_wallet && (
            <p className="text-xs text-gray-500 font-mono" title={program.payout_wallet}>Кошелёк: {maskWallet(program.payout_wallet)}</p>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Сумма выплаты ($)</label>
            <input type="number" min={0.01} step={0.01} value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Хэш транзакции (необязательно)</label>
            <input value={txHash} onChange={e => setTxHash(e.target.value)}
              placeholder="TRC20 tx hash" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Отмена</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
            {saving ? 'Записываем…' : 'Записать'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmPayoutModal({
  payout, onClose, onConfirmed,
}: {
  payout: ReferralPayout
  onClose: () => void
  onConfirmed: (updated: ReferralPayout) => void
}) {
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!txHash.trim()) { setError('Укажите хэш транзакции'); return }
    setSaving(true)
    setError('')
    try {
      const updated = await confirmReferralPayout(payout.id, txHash.trim())
      onConfirmed(updated)
      onClose()
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Подтвердить выплату</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-gray-600">Сумма: <strong>${payout.amount.toFixed(2)}</strong></p>
          {payout.wallet && <p className="text-xs text-gray-500 font-mono" title={payout.wallet}>Кошелёк: {maskWallet(payout.wallet)}</p>}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Хэш транзакции (TRC20) *</label>
            <input value={txHash} onChange={e => setTxHash(e.target.value)}
              placeholder="tx hash" autoFocus className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Отмена</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
            {saving ? 'Подтверждаем…' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReferralDetail() {
  const params = useParams()
  const programId = params.id as string

  const [program, setProgram] = useState<ReferralProgram | null>(null)
  const [programs, setPrograms] = useState<ReferralProgram[]>([])
  const [conversions, setConversions] = useState<ReferralConversion[]>([])
  const [payouts, setPayouts] = useState<ReferralPayout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [showPayout, setShowPayout] = useState(false)
  const [confirmingPayout, setConfirmingPayout] = useState<ReferralPayout | null>(null)
  const [copied, setCopied] = useState(false)
  const [setupUrl, setSetupUrl] = useState('')

  useEffect(() => {
    if (!programId) return
    fetchData()
  }, [programId])

  const fetchData = async () => {
    try {
      const [progs, convs, payoutHistory] = await Promise.all([
        getReferralPrograms(),
        getReferralConversions(programId),
        getReferralPayouts(programId).catch(() => []),
      ])
      setPrograms(progs)
      setProgram(progs.find(p => p.id === programId) || null)
      setConversions(convs)
      setPayouts(payoutHistory)
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (!program) return
    navigator.clipboard.writeText(refLink(program.referral_code))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const createSetupLink = async () => {
    if (!program) return
    try {
      const r = await generatePartnerSetupLink(program.id)
      setSetupUrl(r.setup_url)
      navigator.clipboard.writeText(r.setup_url)
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : (e as Error).message)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!program) return <div className="p-8">Program not found</div>

  const upline = program.upline_id ? programs.find(p => p.id === program.upline_id) : null

  return (
    <div className="max-w-6xl space-y-8">
      <Link href="/admin/referrals" className="text-blue-600 hover:underline flex items-center gap-2 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Referrals
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <h1 className="text-3xl font-bold">{program.name || program.referral_code}</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={createSetupLink} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-semibold">
              Ссылка для регистрации
            </button>
            <button onClick={() => setShowPayout(true)} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-semibold">
              Выплачено
            </button>
            <button onClick={() => setShowEdit(true)} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-semibold">
              Редактировать
            </button>
          </div>
        </div>

        {setupUrl && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm flex items-center justify-between gap-3">
            <span className="truncate">Ссылка (скопирована): <code className="text-blue-700">{setupUrl}</code></span>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2">
          <code className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-blue-700 break-all">
            {refLink(program.referral_code)}
          </code>
          <button onClick={copyLink} className="text-gray-400 hover:text-gray-700">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Ставки комиссий:</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">L1 · {program.l1_pct}%</span>
          <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">L2 · {program.l2_pct}%</span>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">L3 · {program.l3_pct}%</span>
          {upline && (
            <span className="text-xs text-gray-500 ml-2">Аплайн: {upline.name || upline.referral_code}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600">Контакт</p>
            <p className="text-lg font-medium">{program.contact || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-lg font-medium ${program.is_active ? 'text-green-600' : 'text-gray-400'}`}>
              {program.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{conversions.length}</div>
            <div className="text-xs text-gray-600 mt-1">Конверсий</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-green-600">{program.completed}</div>
            <div className="text-xs text-gray-600 mt-1">Завершено</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-yellow-600">{program.pending}</div>
            <div className="text-xs text-gray-600 mt-1">В ожидании</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-600 font-mono">${program.total_earned_l1.toFixed(2)}</div>
            <div className="text-xs text-gray-600 mt-1">L1 ({program.l1_pct}%)</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-600 font-mono">${program.total_earned_l2.toFixed(2)}</div>
            <div className="text-xs text-gray-600 mt-1">L2 ({program.l2_pct}%)</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-600 font-mono">${program.total_earned_l3.toFixed(2)}</div>
            <div className="text-xs text-gray-600 mt-1">L3 ({program.l3_pct}%)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold font-mono">${program.total_earned.toFixed(2)}</div>
            <div className="text-xs text-gray-600 mt-1">Итого заработано</div>
          </div>
          <div className={`rounded-lg p-4 text-center ${program.pending_payout > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
            <div className={`text-lg font-bold font-mono ${program.pending_payout > 0 ? 'text-amber-600' : ''}`}>
              ${program.pending_payout.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600 mt-1">К выплате</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold font-mono text-gray-500">${program.total_paid.toFixed(2)}</div>
            <div className="text-xs text-gray-600 mt-1">Выплачено</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">История выплат</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Запрошено</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Сумма</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Кошелёк</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Хэш</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payouts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Выплат ещё нет</td></tr>
              ) : payouts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{p.requested_at ? new Date(p.requested_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-green-600">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500" title={p.wallet || undefined}>{maskWallet(p.wallet)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.status === 'paid' ? 'Оплачено' : 'Ожидает'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {p.tx_hash ? (
                      <a href={tronscanLink(p.tx_hash)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono text-xs">
                        {p.tx_hash.slice(0, 10)}…
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {p.status === 'pending' && (
                      <button onClick={() => setConfirmingPayout(p)} className="text-blue-600 hover:underline font-semibold">
                        Подтвердить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-bold">Conversions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referee Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Источник</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referrer Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Referee Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Converted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No conversions yet</td>
                </tr>
              ) : (
                conversions.map((conv) => (
                  <tr key={conv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{conv.referee_email || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        conv.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {conv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {conv.source === 'promo' ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800" title={conv.promocode || undefined}>
                          Промокод{conv.promocode ? ` · ${conv.promocode}` : ''}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Реф-ссылка
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={conv.referrer_bonus_paid ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                        {conv.referrer_bonus_paid ? '✓ Paid' : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={conv.referee_bonus_paid ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                        {conv.referee_bonus_paid ? '✓ Paid' : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{conv.completed_at ? new Date(conv.completed_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">{error}</div>}

      {showEdit && (
        <EditModal
          program={program}
          programs={programs}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => { setProgram(updated); setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p)) }}
        />
      )}
      {showPayout && (
        <PayoutModal
          program={program}
          onClose={() => setShowPayout(false)}
          onSaved={(totalPaid) => {
            setProgram(prev => prev ? { ...prev, total_paid: totalPaid, pending_payout: Math.round((prev.total_earned - totalPaid) * 100) / 100 } : prev)
            getReferralPayouts(program.id).then(setPayouts).catch(() => {})
          }}
        />
      )}
      {confirmingPayout && (
        <ConfirmPayoutModal
          payout={confirmingPayout}
          onClose={() => setConfirmingPayout(null)}
          onConfirmed={(updated) => {
            setPayouts(prev => prev.map(p => p.id === updated.id ? updated : p))
            setProgram(prev => prev
              ? { ...prev, total_paid: prev.total_paid + updated.amount, pending_payout: Math.round((prev.total_earned - (prev.total_paid + updated.amount)) * 100) / 100 }
              : prev)
          }}
        />
      )}
    </div>
  )
}
