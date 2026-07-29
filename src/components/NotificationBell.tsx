'use client'
import { useEffect, useRef, useState } from 'react'
import { Bell, BellRing, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { api } from '@/lib/api-client'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

// Module-level flag: only one instance auto-opens the dropdown
let _autoOpenDone = false

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  created_at: string
}

function timeAgo(iso: string, locale: 'ru' | 'en') {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return t('notif.just_now', locale)
  if (diff < 3600) return `${Math.floor(diff / 60)} ${locale === 'ru' ? 'мин' : 'min'}`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${locale === 'ru' ? 'ч' : 'h'}`
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' })
}

export function NotificationBell() {
  const locale = useLocale()
  const [items, setItems] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left?: number; right?: number; dropW: number }>({ top: 0, right: 0, dropW: 320 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    api.get<Notification[]>('/v1/notifications/?unread_only=true&limit=10')
      .then(data => {
        setItems(data)
        if (!_autoOpenDone && data.length > 0 && btnRef.current) {
          _autoOpenDone = true
          // Slightly delay to let layout settle
          setTimeout(() => {
            if (btnRef.current) {
              const rect = btnRef.current.getBoundingClientRect()
              const vw = window.innerWidth
              const dropW = Math.min(320, vw - 16)
              const right = Math.max(8, vw - rect.right)
              setDropdownPos({ top: rect.bottom + 8, right: Math.min(right, vw - dropW - 8), dropW })
            }
            setOpen(true)
            autoCloseTimer.current = setTimeout(() => setOpen(false), 10000)
          }, 600)
        }
      })
      .catch(() => {})
    return () => clearTimeout(autoCloseTimer.current)
  }, [])

  function openDropdown() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const dropW = Math.min(320, vw - 16)
      const inLeftHalf = (rect.left + rect.width / 2) < vw / 2
      if (inLeftHalf) {
        // open rightward — clamp so right edge stays on screen
        const left = Math.min(rect.left, vw - dropW - 8)
        setDropdownPos({ top: rect.bottom + 8, left: Math.max(8, left), dropW })
      } else {
        // open leftward — clamp so left edge stays on screen
        const right = Math.max(8, vw - rect.right)
        setDropdownPos({ top: rect.bottom + 8, right: Math.min(right, vw - dropW - 8), dropW })
      }
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  async function dismiss(id: string) {
    await api.post(`/v1/notifications/${id}/read`, {}).catch(() => {})
    setItems(prev => prev.filter(n => n.id !== id))
  }

  async function dismissAll() {
    await api.post('/v1/notifications/read-all', {}).catch(() => {})
    setItems([])
    setOpen(false)
  }

  const count = items.length

  const dropdown = open && typeof document !== 'undefined' ? createPortal(
    <div
      ref={dropRef}
      className="fixed z-[9999] rounded-2xl shadow-2xl border-2 border-ink overflow-hidden"
      style={{
        width: dropdownPos.dropW,
        top: dropdownPos.top,
        ...(dropdownPos.left !== undefined ? { left: dropdownPos.left } : { right: dropdownPos.right }),
        background: 'var(--paper)',
        boxShadow: '4px 4px 0 #111',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-ink/10">
        <span className="font-extrabold text-sm">{t('nav.notifications', locale)}</span>
        <div className="flex items-center gap-3">
          {count > 1 && (
            <button onClick={dismissAll} className="text-xs font-bold text-ink/40 hover:text-ink transition-colors">
              {t('notif.mark_read', locale)}
            </button>
          )}
          <button onClick={() => setOpen(false)} className="opacity-30 hover:opacity-80 transition-opacity">
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {count === 0 ? (
        <p className="px-4 py-8 text-center text-sm font-semibold text-ink/30">{t('notif.empty', locale)}</p>
      ) : (
        <div className="divide-y divide-ink/5 max-h-72 overflow-y-auto">
          {items.map(n => (
            <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-cream transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm leading-tight">{n.title}</p>
                {n.message && (
                  <p className="text-xs font-semibold text-ink/60 mt-0.5 leading-snug">{n.message}</p>
                )}
                <p className="text-[10px] font-bold text-ink/30 mt-1">{timeAgo(n.created_at, locale)}</p>
              </div>
              <button
                onClick={() => dismiss(n.id)}
                className="shrink-0 opacity-25 hover:opacity-70 transition-opacity mt-0.5"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        ref={btnRef}
        onClick={openDropdown}
        className="relative w-9 h-9 flex items-center justify-center rounded-2xl border-2 border-transparent hover:border-ink hover:bg-cream transition-colors"
        aria-label={t('nav.notifications', locale)}
      >
        {count > 0
          ? <BellRing className="w-4 h-4" strokeWidth={2.5} style={{ animation: 'bell-ring 2.4s ease-in-out infinite' }} />
          : <Bell className="w-4 h-4 opacity-40" strokeWidth={2.5} />
        }
        <style>{`
          @keyframes bell-ring {
            0%, 60%, 100% { transform: rotate(0deg); }
            65%  { transform: rotate(10deg); }
            70%  { transform: rotate(-9deg); }
            75%  { transform: rotate(7deg); }
            80%  { transform: rotate(-5deg); }
            85%  { transform: rotate(3deg); }
            90%  { transform: rotate(0deg); }
          }
        `}</style>
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
            style={{ background: 'var(--ink)' }}
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      {dropdown}
    </>
  )
}
