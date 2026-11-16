'use client'
import { useEffect, useState } from 'react'
import { Zap, WifiOff } from 'lucide-react'
import { useLocale } from '@/lib/useLocale'

type State = { kind: 'loading' } | { kind: 'ok'; ms: number } | { kind: 'down' }

function pingUrl(host: string): string {
  return `https://${host.replace(/\./g, '-')}.sslip.io/ping`
}

// Real latency from the visitor's own network: 1 warm-up request (pays for DNS, TCP and TLS)
// followed by 3 timed requests on the same HTTP/2 connection, i.e. about one round trip each.
async function measure(host: string): Promise<number | null> {
  const url = pingUrl(host)
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), 6000)
  const samples: number[] = []
  try {
    for (let i = 0; i < 4; i++) {
      const t0 = performance.now()
      const res = await fetch(`${url}?i=${i}&t=${Date.now()}`, { cache: 'no-store', mode: 'cors', signal: ctl.signal })
      if (res.status !== 204) throw new Error('unexpected status')
      if (i > 0) samples.push(performance.now() - t0)
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
  samples.sort((a, b) => a - b)
  return Math.round(samples[Math.floor(samples.length / 2)])
}

// Latency from the entry node to the exit (measured on the entry itself, published next to /ping).
// The bridge port identifies the exit; the total shown = visitor→entry + entry→exit, like a client-side test through the tunnel.
async function leg(host: string, port?: number): Promise<number> {
  if (!port) return 0
  try {
    const res = await fetch(`https://${host.replace(/\./g, '-')}.sslip.io/legs.json?t=${Date.now()}`, { cache: 'no-store', mode: 'cors' })
    const v = (await res.json())?.[String(port)]
    return typeof v === 'number' ? v : 0
  } catch {
    return 0
  }
}

export function LivePing({ host, port }: { host?: string; port?: number }) {
  const locale = useLocale()
  const ru = locale === 'ru'
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    if (!host) return
    let cancelled = false
    async function run() {
      const entry = await measure(host as string)
      const ms = entry === null ? null : entry + (await leg(host as string, port))
      if (!cancelled) setState(ms === null ? { kind: 'down' } : { kind: 'ok', ms })
    }
    run()
    const id = setInterval(run, 60000)
    return () => { cancelled = true; clearInterval(id) }
  }, [host, port])

  if (!host) return null

  if (state.kind === 'loading') {
    return (
      <span className="chip whitespace-nowrap" style={{ background: 'var(--paper)' }}>
        <span className="text-xs font-bold text-ink/40">{ru ? 'Пинг…' : 'Ping…'}</span>
      </span>
    )
  }
  if (state.kind === 'down') {
    return (
      <span className="chip whitespace-nowrap" style={{ background: '#fee2e2', color: '#dc2626' }} title={ru ? 'Сервер не отвечает из вашей сети' : 'Server is not reachable from your network'}>
        <WifiOff className="w-3 h-3 shrink-0" strokeWidth={2.5} />
        <span className="text-xs font-bold">{ru ? 'недоступен' : 'unreachable'}</span>
      </span>
    )
  }
  const bg = state.ms < 100 ? 'var(--green-100)' : state.ms < 220 ? 'var(--yellow)' : '#fee2e2'
  return (
    <span className="chip whitespace-nowrap" style={{ background: bg }} title={ru ? 'Пинг от вашего устройства до сервера, обновляется раз в минуту' : 'Ping from your device to the server, refreshed every minute'}>
      <Zap className="w-3 h-3 shrink-0" strokeWidth={3} />
      <span className="text-xs font-bold tabular-nums">{state.ms} {ru ? 'мс' : 'ms'}</span>
    </span>
  )
}
