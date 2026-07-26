'use client'
import { useEffect, useState, useCallback } from 'react'
import { adminReq } from '@/lib/admin-api'

interface AdminCard {
  id: string
  user_email: string
  user_name: string
  last4: string
  card_holder: string
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'expired'
  expiry_month: number
  expiry_year: number
  created_at: string | null
}

interface CardTx {
  id: string
  amount: number
  currency: string
  merchant: string
  type: 'debit' | 'credit'
  status: string
  created_at: string | null
}

const STATUS_BADGE: Record<string, { text: string; cls: string }> = {
  active:  { text: 'Активна',      cls: 'bg-green-100 text-green-700' },
  frozen:  { text: 'Заморожена',   cls: 'bg-blue-100 text-blue-700' },
  expired: { text: 'Истекла',      cls: 'bg-gray-100 text-gray-500' },
}

function statusBadge(s: string) {
  const b = STATUS_BADGE[s] ?? { text: s, cls: 'bg-gray-100 text-gray-500' }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.cls}`}>{b.text}</span>
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<AdminCard[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedCard, setSelectedCard] = useState<AdminCard | null>(null)
  const [txs, setTxs] = useState<CardTx[]>([])
  const [txLoading, setTxLoading] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const PAGE_SIZE = 30

  const load = useCallback(async (p = 1) => {
    setLoading(true); setError('')
    try {
      const q = new URLSearchParams({ page: String(p), page_size: String(PAGE_SIZE) })
      if (statusFilter) q.set('status', statusFilter)
      if (search) q.set('search', search)
      const r = await adminReq<{ total: number; page: number; items: AdminCard[] }>(
        `/v1/admin/cards?${q}`
      )
      setCards(r.items)
      setTotal(r.total)
      setPage(p)
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [statusFilter, search])

  useEffect(() => { load(1) }, [load])

  async function openCard(card: AdminCard) {
    setSelectedCard(card)
    setTxs([])
    setTxLoading(true)
    try {
      const r = await adminReq<{ transactions: CardTx[] }>(`/v1/admin/cards/${card.id}/transactions`)
      setTxs(r.transactions)
    } catch {}
    finally { setTxLoading(false) }
  }

  async function setCardStatus(cardId: string, status: string) {
    setStatusUpdating(true)
    try {
      await adminReq(`/v1/admin/cards/${cardId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setSelectedCard(prev => prev ? { ...prev, status: status as AdminCard['status'] } : prev)
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: status as AdminCard['status'] } : c))
    } catch (e) { setError((e as Error).message) }
    finally { setStatusUpdating(false) }
  }

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Виртуальные карты</h1>
          <p className="text-sm text-gray-500">Все выданные карты пользователей</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-right">
          <div className="text-xs text-gray-400">Всего карт</div>
          <div className="text-lg font-bold text-gray-900">{total}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <form
          onSubmit={e => { e.preventDefault(); setSearch(searchInput); }}
          className="flex gap-2"
        >
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Email, last4, имя…"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white w-56"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
          >
            Найти
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setSearch('') }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
            >
              ✕
            </button>
          )}
        </form>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="frozen">Замороженные</option>
          <option value="expired">Истекшие</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Пользователь</th>
                <th className="text-left px-4 py-3">Держатель</th>
                <th className="text-left px-4 py-3">Номер</th>
                <th className="text-right px-4 py-3">Баланс</th>
                <th className="text-left px-4 py-3">Срок</th>
                <th className="text-left px-4 py-3">Статус</th>
                <th className="text-left px-4 py-3">Создана</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cards.map(c => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => openCard(c)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 text-xs truncate max-w-[180px]">{c.user_email}</div>
                    {c.user_name && <div className="text-xs text-gray-400">{c.user_name}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{c.card_holder}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">•••• {c.last4}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    ${c.balance.toFixed(2)} <span className="text-xs text-gray-400">{c.currency}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {String(c.expiry_month).padStart(2, '0')}/{String(c.expiry_year).slice(-2)}
                  </td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('ru') : '—'}
                  </td>
                </tr>
              ))}
              {!loading && cards.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                    Карт не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-2 justify-end items-center">
          <button
            onClick={() => load(page - 1)}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >←</button>
          <span className="px-3 py-1.5 text-sm text-gray-500">{page} / {pages}</span>
          <button
            onClick={() => load(page + 1)}
            disabled={page >= pages || loading}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >→</button>
        </div>
      )}

      {/* Card detail modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <div className="font-bold text-gray-900 text-lg mb-0.5">
                  •••• •••• •••• {selectedCard.last4}
                </div>
                <div className="text-sm text-gray-500">{selectedCard.user_email}</div>
                <div className="text-sm text-gray-500">{selectedCard.card_holder}</div>
              </div>
              <button onClick={() => setSelectedCard(null)} className="text-gray-400 hover:text-gray-600 mt-1">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Баланс</div>
                  <div className="font-bold text-gray-900">${selectedCard.balance.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Срок</div>
                  <div className="font-bold text-gray-900 font-mono text-sm">
                    {String(selectedCard.expiry_month).padStart(2, '0')}/{String(selectedCard.expiry_year).slice(-2)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Статус</div>
                  <div className="mt-0.5">{statusBadge(selectedCard.status)}</div>
                </div>
              </div>

              {/* Status actions */}
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Управление</div>
                <div className="flex gap-2 flex-wrap">
                  {selectedCard.status !== 'active' && (
                    <button
                      onClick={() => setCardStatus(selectedCard.id, 'active')}
                      disabled={statusUpdating}
                      className="px-3 py-1.5 rounded-lg border border-green-200 text-green-700 text-sm font-medium hover:bg-green-50 disabled:opacity-50 transition"
                    >
                      Активировать
                    </button>
                  )}
                  {selectedCard.status === 'active' && (
                    <button
                      onClick={() => setCardStatus(selectedCard.id, 'frozen')}
                      disabled={statusUpdating}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 disabled:opacity-50 transition"
                    >
                      Заморозить
                    </button>
                  )}
                  {selectedCard.status !== 'expired' && (
                    <button
                      onClick={() => { if (confirm('Пометить как истекшую?')) setCardStatus(selectedCard.id, 'expired') }}
                      disabled={statusUpdating}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                      Истекла
                    </button>
                  )}
                </div>
              </div>

              {/* Transactions */}
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Операции
                </div>
                {txLoading && <div className="text-sm text-gray-400 py-4 text-center">Загрузка…</div>}
                {!txLoading && txs.length === 0 && (
                  <div className="text-sm text-gray-400 py-4 text-center">Операций нет</div>
                )}
                {!txLoading && txs.length > 0 && (
                  <div className="space-y-1">
                    {txs.map(tx => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: tx.type === 'credit' ? '#dcfce7' : '#f9fafb' }}
                          >
                            {tx.type === 'credit' ? '↓' : '↑'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tx.merchant}</div>
                            <div className="text-xs text-gray-400">
                              {tx.created_at ? new Date(tx.created_at).toLocaleString('ru', {
                                day: '2-digit', month: '2-digit', year: '2-digit',
                                hour: '2-digit', minute: '2-digit',
                              }) : '—'}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.type === 'credit' ? '+' : '−'}{Math.abs(tx.amount).toFixed(2)} {tx.currency}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
