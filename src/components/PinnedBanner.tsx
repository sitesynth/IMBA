'use client'
import { useEffect, useState } from 'react'
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api-client'

interface PinnedMessage {
  id: string
  title: string | null
  content: string
  kind: 'info' | 'warning' | 'success'
}

const KIND = {
  info:    { icon: Info,          bg: 'var(--blue-100)',   border: '#2E7DF6', text: '#1a4fa0' },
  warning: { icon: AlertTriangle, bg: '#fff8e6',           border: '#f0b429', text: '#7a5500' },
  success: { icon: CheckCircle,   bg: 'var(--green-100)',  border: '#55DB9C', text: '#1a6644' },
}

export function PinnedBanner() {
  const [msg, setMsg] = useState<PinnedMessage | null | 'loading'>('loading')

  useEffect(() => {
    api.get<PinnedMessage | null>('/v1/me/pinned-message')
      .then(data => {
        if (!data) { setMsg(null); return }
        const dismissed = localStorage.getItem(`pinned_dismissed_${data.id}`)
        setMsg(dismissed ? null : data)
      })
      .catch(() => setMsg(null))
  }, [])

  if (!msg || msg === 'loading') return null

  const { icon: Icon, bg, border, text } = KIND[msg.kind] ?? KIND.info

  function dismiss() {
    if (msg && msg !== 'loading') {
      localStorage.setItem(`pinned_dismissed_${msg.id}`, '1')
    }
    setMsg(null)
  }

  return (
    <div
      className="rounded-2xl px-4 py-3 flex gap-3 items-start"
      style={{ background: bg, border: `2px solid ${border}` }}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: text }} strokeWidth={2.5} />
      <div className="flex-1 min-w-0">
        {msg.title && (
          <p className="font-extrabold text-sm mb-0.5" style={{ color: text }}>{msg.title}</p>
        )}
        <p className="text-sm font-semibold leading-snug" style={{ color: text, opacity: 0.85 }}>
          {msg.content}
        </p>
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 mt-0.5 transition-opacity hover:opacity-70"
        style={{ color: text, opacity: 0.4 }}
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
