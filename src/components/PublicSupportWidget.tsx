'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LifeBuoy, X, Send } from 'lucide-react'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.imba.live'
const STORAGE_KEY = 'imba_guest_ticket'
const POLL_MS = 15000

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

interface StoredSession { ticket_id: string; name: string; contact: string }

type Step = 'identify' | 'chat'

export function PublicSupportWidget() {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('identify')

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  const [ticketId, setTicketId] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<SupportMessage[]>([])
  const [loaded, setLoaded] = useState(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined)

  function loadSession(): StoredSession | null {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
  }
  function saveSession(s: StoredSession) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
  }

  const fetchTicket = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/v1/support/guest/${id}`)
      if (!res.ok) return
      const data = await res.json()
      setTranscript(data.transcript ?? [])
    } catch {}
  }, [])

  function startPolling(id: string) {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(() => fetchTicket(id), POLL_MS)
  }

  useEffect(() => () => clearInterval(pollRef.current), [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript.length])

  function handleOpen() {
    const session = loadSession()
    if (session) {
      setName(session.name)
      setContact(session.contact)
      setTicketId(session.ticket_id)
      setStep('chat')
      fetchTicket(session.ticket_id).then(() => setLoaded(true))
      startPolling(session.ticket_id)
    } else {
      setStep('identify')
      setLoaded(false)
      setTimeout(() => nameRef.current?.focus(), 50)
    }
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    clearInterval(pollRef.current)
  }

  function handleIdentifyNext(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return
    setStep('chat')
    setLoaded(true)
  }

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setDraft('')
    try {
      if (ticketId) {
        const res = await fetch(`${API_BASE}/v1/support/guest/${ticketId}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setTranscript(data.transcript ?? [])
      } else {
        const res = await fetch(`${API_BASE}/v1/support/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), contact: contact.trim(), message: text }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const id: string = data.ticket_id
        setTicketId(id)
        saveSession({ ticket_id: id, name: name.trim(), contact: contact.trim() })
        await fetchTicket(id)
        startPolling(id)
      }
    } catch {
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-ink/10 flex-shrink-0" style={{ background: 'var(--violet-100)' }}>
        <div>
          <p className="font-extrabold text-sm">{t('support.title', locale)}</p>
          <p className="text-xs font-semibold text-ink/50">{t('support.subtitle', locale)}</p>
        </div>
        <button onClick={handleClose} className="opacity-40 hover:opacity-80 transition-opacity" aria-label="Close">
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Identify step */}
      {step === 'identify' && (
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <form onSubmit={handleIdentifyNext} className="flex flex-col gap-3 mt-4">
            <div className="text-center mb-2">
              <p className="text-2xl mb-2">👋</p>
              <p className="text-sm font-bold text-ink/70">{t('support.guest_identify', locale)}</p>
              <p className="text-xs font-semibold text-ink/40 mt-1">{t('support.guest_identify_sub', locale)}</p>
            </div>
            <input
              ref={nameRef}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('support.guest_name', locale)}
              required
              className="w-full rounded-2xl border-2 border-ink/15 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-ink bg-cream"
            />
            <input
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder={t('support.guest_contact', locale)}
              required
              className="w-full rounded-2xl border-2 border-ink/15 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-ink bg-cream"
            />
            <button
              type="submit"
              disabled={!name.trim() || !contact.trim()}
              className="w-full rounded-full border-2 border-ink py-2.5 text-sm font-extrabold disabled:opacity-30 transition-opacity"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              {t('support.guest_next', locale)}
            </button>
          </form>
        </div>
      )}

      {/* Chat step */}
      {step === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0">
            {!loaded ? (
              <p className="text-center text-xs font-semibold text-ink/30 mt-8">{t('support.loading', locale)}</p>
            ) : transcript.length === 0 ? (
              <div className="text-center mt-8 px-4">
                <p className="text-2xl mb-2">👋</p>
                <p className="text-sm font-bold text-ink/70">{t('support.guest_greeting', locale)}, {name.split(' ')[0]}!</p>
                <p className="text-xs font-semibold text-ink/40 mt-1">{t('support.greeting_sub', locale)}</p>
              </div>
            ) : (
              transcript.map((m, i) => {
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
                          {t(`support.event_${ev}` as Parameters<typeof t>[0], locale)}
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

          <div className="flex items-end gap-2 p-3 border-t-2 border-ink/10 flex-shrink-0">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
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
        </>
      )}
    </div>,
    document.body,
  ) : null

  return (
    <>
      <button
        onClick={() => open ? handleClose() : handleOpen()}
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
