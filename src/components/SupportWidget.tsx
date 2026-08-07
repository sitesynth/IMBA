'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LifeBuoy, X, Send } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useToast } from '@/components/ToastProvider'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

interface SupportMessage {
  role: 'user' | 'admin' | 'system'
  event?: 'opened' | 'closed' | 'reopened'
  text: string
  at: string
}

const EVENT_STYLE: Record<string, { icon: string; bg: string }> = {
  opened:   { icon: '🎫', bg: 'var(--violet-100)' },
  closed:   { icon: '✅', bg: 'var(--green-100, #dcfce7)' },
  reopened: { icon: '↩️', bg: 'var(--yellow-100, #fefce8)' },
}

interface TicketSummary {
  ticket_id: string
  status: string
}

interface TicketDetail {
  ticket_id: string
  status: string
  transcript: SupportMessage[]
}

const POLL_MS = 15000

export function SupportWidget() {
  const locale = useLocale()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined)

  async function loadActiveTicket() {
    try {
      const tickets = await api.get<TicketSummary[]>('/v1/support/tickets')
      const active = tickets.find(ti => ti.status !== 'closed') ?? tickets[0]
      if (active) {
        const detail = await api.get<TicketDetail>(`/v1/support/tickets/${active.ticket_id}`)
        setTicket(detail)
      }
    } catch {
      // no tickets yet, or offline — start blank
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => {
    if (!open) return
    if (!loaded) loadActiveTicket()
    pollRef.current = setInterval(() => {
      if (ticket) {
        api.get<TicketDetail>(`/v1/support/tickets/${ticket.ticket_id}`)
          .then(setTicket)
          .catch(() => {})
      }
    }, POLL_MS)
    return () => clearInterval(pollRef.current)
  }, [open, loaded, ticket?.ticket_id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.transcript.length])

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setDraft('')
    try {
      const detail = ticket
        ? await api.post<TicketDetail>(`/v1/support/tickets/${ticket.ticket_id}/messages`, { message: text })
        : await api.post<TicketDetail>('/v1/support/tickets', { message: text })
      setTicket(detail)
    } catch {
      toast(t('support.send_error', locale), 'error')
      setDraft(text)
    } finally {
      setSending(false)
    }
  }

  const panel = open && typeof document !== 'undefined' ? createPortal(
    <div
      className="fixed z-[9999] flex flex-col rounded-3xl border-2 border-ink overflow-hidden"
      style={{
        bottom: 88, right: 16,
        width: 'min(380px, calc(100vw - 32px))',
        height: 'min(520px, calc(100vh - 120px))',
        background: 'var(--paper)',
        boxShadow: '5px 5px 0 #111',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-ink/10" style={{ background: 'var(--violet-100)' }}>
        <div>
          <p className="font-extrabold text-sm">{t('support.title', locale)}</p>
          <p className="text-xs font-semibold text-ink/50">{t('support.subtitle', locale)}</p>
        </div>
        <button onClick={() => setOpen(false)} className="opacity-40 hover:opacity-80 transition-opacity">
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {!loaded ? (
          <p className="text-center text-xs font-semibold text-ink/30 mt-8">{t('support.loading', locale)}</p>
        ) : !ticket || ticket.transcript.length === 0 ? (
          <div className="text-center mt-8 px-4">
            <p className="text-2xl mb-2">👋</p>
            <p className="text-sm font-bold text-ink/70">{t('support.greeting', locale)}</p>
            <p className="text-xs font-semibold text-ink/40 mt-1">{t('support.greeting_sub', locale)}</p>
          </div>
        ) : (
          ticket.transcript.map((m, i) => {
            if (m.role === 'system') {
              const ev = m.event ?? 'opened'
              const style = EVENT_STYLE[ev] ?? EVENT_STYLE.opened
              return (
                <div key={i} className="flex justify-center py-1">
                  <div
                    className="max-w-[85%] rounded-2xl border-2 border-ink/10 px-3.5 py-2 text-center"
                    style={{ background: style.bg }}
                  >
                    <p className="text-xs font-extrabold">
                      <span className="mr-1">{style.icon}</span>
                      {t(`support.event_${ev}`, locale)}
                    </p>
                    {ev === 'closed' && (
                      <p className="text-[11px] font-semibold text-ink/50 mt-0.5 leading-snug">
                        {t('support.event_closed_sub', locale)}
                      </p>
                    )}
                  </div>
                </div>
              )
            }
            return (
              <div key={i} className={`flex ${m.role === 'admin' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold"
                  style={{
                    background: m.role === 'admin' ? 'var(--cream)' : 'var(--ink)',
                    color: m.role === 'admin' ? 'var(--ink)' : 'var(--paper)',
                  }}
                >
                  <p className="whitespace-pre-wrap leading-snug">{m.text}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 p-3 border-t-2 border-ink/10">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder={t('support.placeholder', locale)}
          rows={1}
          className="flex-1 rounded-2xl border-2 border-ink/15 px-3.5 py-2.5 text-sm font-semibold resize-none focus:outline-none focus:border-ink bg-cream"
          style={{ maxHeight: 96 }}
        />
        <button
          onClick={send}
          disabled={!draft.trim() || sending}
          className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-ink disabled:opacity-30 transition-opacity"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          aria-label={t('support.aria', locale)}
        >
          <Send className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed z-[9998] w-14 h-14 rounded-full border-2 border-ink flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ bottom: 20, right: 16, background: 'var(--yellow)', boxShadow: '4px 4px 0 #111' }}
        aria-label={t('support.aria', locale)}
      >
        {open ? <X className="w-5 h-5" strokeWidth={2.5} /> : <LifeBuoy className="w-6 h-6" strokeWidth={2.5} />}
      </button>
      {panel}
    </>
  )
}
