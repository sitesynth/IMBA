import { Zap } from 'lucide-react'

// Ping to the server as measured from Russia by the backend (refreshed every minute).
export function PingBadge({ ping }: { ping?: number }) {
  if (!ping) {
    return (
      <span className="chip whitespace-nowrap" style={{ background: 'var(--paper)' }} title="Пинг ещё не измерен">
        <span className="text-xs font-bold text-ink/40">Пинг —</span>
      </span>
    )
  }
  const bg = ping < 80 ? 'var(--green-100)' : ping < 150 ? 'var(--yellow)' : '#fee2e2'
  return (
    <span className="chip whitespace-nowrap" style={{ background: bg }} title="Пинг до сервера из России, обновляется раз в минуту">
      <Zap className="w-3 h-3 shrink-0" strokeWidth={3} />
      <span className="text-xs font-bold tabular-nums">{ping} мс</span>
    </span>
  )
}
