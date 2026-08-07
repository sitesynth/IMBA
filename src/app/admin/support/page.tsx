'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Send, Loader2, X, CheckCircle } from 'lucide-react'

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}
import {
  getSupport, getSupportTicket, replySupportTicket, setSupportStatus,
  SupportTicket, SupportTicketDetail, AdminApiError,
} from '@/lib/admin-api'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
]

const STATUS_STYLE: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  closed: 'bg-green-100 text-green-800',
}

const STATUS_OPTIONS = ['open', 'in_progress', 'closed']

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminSupport() {
  // ── List state ───────────────────────────────────────────────
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')

  // ── Chat state ───────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Load list ────────────────────────────────────────────────
  useEffect(() => {
    setListLoading(true)
    getSupport({ limit: 100, status: statusFilter || undefined })
      .then(setTickets)
      .catch((e) => setListError((e as Error).message))
      .finally(() => setListLoading(false))
  }, [statusFilter])

  // ── Load chat ────────────────────────────────────────────────
  const loadTicket = useCallback(async (id: string) => {
    setChatLoading(true)
    setChatError('')
    setTicket(null)
    try {
      const data = await getSupportTicket(id)
      setTicket(data)
    } catch (e) {
      setChatError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setChatLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedId) loadTicket(selectedId)
  }, [selectedId, loadTicket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.transcript.length])

  // ── Paste handler ─────────────────────────────────────────────
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (!selectedId) return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) attachImage(file)
          break
        }
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [selectedId])

  function attachImage(file: File) {
    setPendingImage(file)
    setPendingPreview(URL.createObjectURL(file))
  }

  function clearImage() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingImage(null)
    setPendingPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Send reply ───────────────────────────────────────────────
  async function send() {
    if ((!reply.trim() && !pendingImage) || sending || !selectedId) return
    setSending(true)
    try {
      let imageUrl: string | undefined
      if (pendingImage) {
        imageUrl = await fileToDataUrl(pendingImage)
        clearImage()
      }
      const res = await replySupportTicket(selectedId, reply.trim() || ' ', imageUrl)
      setTicket((prev) => prev ? { ...prev, status: res.status, transcript: res.transcript } : prev)
      setTickets((prev) => prev.map((t) => t.ticket_id === selectedId ? { ...t, status: res.status } : t))
      setReply('')
    } catch (e) {
      setChatError(e instanceof AdminApiError ? e.message : (e as Error).message)
    } finally {
      setSending(false)
    }
  }

  async function changeStatus(status: string) {
    if (!ticket || !selectedId) return
    try {
      await setSupportStatus(selectedId, status)
      setTicket((prev) => prev ? { ...prev, status } : prev)
      setTickets((prev) => prev.map((t) => t.ticket_id === selectedId ? { ...t, status } : t))
    } catch (e) {
      setChatError(e instanceof AdminApiError ? e.message : (e as Error).message)
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] flex gap-0 overflow-hidden -mx-6 -my-6">

      {/* ── LEFT: ticket list ── */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Support</h1>
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === f.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {listLoading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
          ) : listError ? (
            <div className="p-6 text-center text-red-500 text-sm">{listError}</div>
          ) : tickets.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No tickets</div>
          ) : (
            tickets.map((t) => (
              <button
                key={t.ticket_id}
                onClick={() => setSelectedId(t.ticket_id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                  selectedId === t.ticket_id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 truncate">{t.subject}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${STATUS_STYLE[t.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate">{t.email || t.user_id}</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(t.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: chat panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a ticket to start chatting
          </div>
        ) : chatLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : chatError && !ticket ? (
          <div className="flex-1 flex items-center justify-center text-red-500 text-sm">{chatError}</div>
        ) : ticket ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">{ticket.subject}</div>
                <div className="text-xs text-gray-500">
                  {ticket.email || ticket.user_id}{ticket.name ? ` · ${ticket.name}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[ticket.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {ticket.status}
                </span>
                <select
                  value={ticket.status}
                  onChange={(e) => changeStatus(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {ticket.status !== 'closed' && (
                  <button
                    onClick={() => changeStatus('closed')}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                    title="Close ticket"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {ticket.transcript.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                      m.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    {m.image_url && (
                      m.image_url.startsWith('data:application/pdf') ? (
                        <a
                          href={m.image_url}
                          download="attachment.pdf"
                          className={`flex items-center gap-1.5 text-xs font-medium underline mb-2 ${m.role === 'admin' ? 'text-white/80' : 'text-blue-600'}`}
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          </svg>
                          PDF attachment
                        </a>
                      ) : (
                        <a href={m.image_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={m.image_url}
                            alt="attachment"
                            className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90"
                            style={{ maxHeight: 300 }}
                          />
                        </a>
                      )
                    )}
                    {m.text.trim() && <p className="whitespace-pre-wrap">{m.text}</p>}
                    <p className={`text-[10px] mt-1 ${m.role === 'admin' ? 'text-white/50' : 'text-gray-400'}`}>
                      {new Date(m.at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
              {chatError && <p className="text-xs text-red-500 mb-2">{chatError}</p>}

              {/* Image preview */}
              {pendingPreview && (
                <div className="relative inline-block mb-2">
                  <img src={pendingPreview} alt="pending" className="h-20 rounded-lg border border-gray-200" />
                  <button
                    onClick={clearImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex gap-2 items-end">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) attachImage(f)
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="self-end p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Attach image or PDF (or paste screenshot)"
                >
                  <PaperclipIcon className="w-4 h-4" />
                </button>

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                  }}
                  placeholder="Type a reply… (Enter to send, paste screenshot)"
                  rows={2}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  onClick={send}
                  disabled={(!reply.trim() && !pendingImage) || sending}
                  className="self-end px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40 flex items-center gap-1.5"
                >
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Send
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
