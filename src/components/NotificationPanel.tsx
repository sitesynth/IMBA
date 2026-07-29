'use client'
import { useEffect, useState } from 'react'
import { X, BellRing } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

interface Notification {
  id: string
  notification_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  data: Record<string, unknown>
}

function timeAgo(iso: string, locale: 'ru' | 'en'): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return t('notif.just_now', locale)
  if (diff < 3600) return `${Math.floor(diff / 60)} ${locale === 'ru' ? 'мин назад' : 'min ago'}`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${locale === 'ru' ? 'ч назад' : 'h ago'}`
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' })
}

export function NotificationPanel() {
  const locale = useLocale()
  const [items, setItems] = useState<Notification[]>([])

  useEffect(() => {
    api.get<Notification[]>('/v1/notifications/?unread_only=true&limit=10')
      .then(setItems)
      .catch(() => {})
  }, [])

  if (items.length === 0) return null

  async function dismiss(id: string) {
    await api.post(`/v1/notifications/${id}/read`, {})
    setItems(prev => prev.filter(n => n.id !== id))
  }

  async function dismissAll() {
    await api.post('/v1/notifications/read-all', {})
    setItems([])
  }

  return (
    <div className="space-y-2">
      {items.map(n => (
        <div
          key={n.id}
          className="panel flex gap-3 items-start"
          style={{ background: 'var(--paper)', border: '2px solid var(--ink)' }}
        >
          <BellRing className="w-4 h-4 mt-0.5 shrink-0 opacity-50" strokeWidth={2.5} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-extrabold text-sm leading-tight">{n.title}</p>
              <span className="text-xs text-ink/40 shrink-0">{timeAgo(n.created_at, locale)}</span>
            </div>
            <p className="text-sm font-semibold text-ink/60 mt-1 leading-snug">{n.message}</p>
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="shrink-0 mt-0.5 opacity-30 hover:opacity-70 transition-opacity"
            aria-label={t('nav.close', locale)}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      ))}

      {items.length > 1 && (
        <button
          onClick={dismissAll}
          className="pill pill-paper pill-sm w-full justify-center text-ink/50"
        >
          {t('notif.mark_read', locale)}
        </button>
      )}
    </div>
  )
}
