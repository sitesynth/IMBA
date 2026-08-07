'use client'
import { useState, useEffect } from 'react'
import { Zap, RefreshCw, Wifi } from 'lucide-react'

const PROBE = 'https://38-19-201-176.sslip.io/speedtest'

type State = 'cached' | 'idle' | 'ping' | 'download' | 'done' | 'error'

interface CachedResult { ping: number; speed: number; ts: number }

interface Props {
  /** unique key for localStorage, e.g. server ID */
  cacheKey?: string
  probeUrl?: string
}

function readCache(key: string): CachedResult | null {
  try {
    const raw = localStorage.getItem(`speed:${key}`)
    return raw ? (JSON.parse(raw) as CachedResult) : null
  } catch { return null }
}

function writeCache(key: string, result: CachedResult) {
  try { localStorage.setItem(`speed:${key}`, JSON.stringify(result)) } catch { /* noop */ }
}

export function SpeedBadge({ cacheKey = 'default', probeUrl = PROBE }: Props) {
  const [state, setState] = useState<State>('idle')
  const [ping, setPing] = useState<number | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)

  // Load cached result on mount
  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) {
      setPing(cached.ping)
      setSpeed(cached.speed)
      setState('cached')
    }
  }, [cacheKey])

  async function run(e: React.MouseEvent) {
    e.stopPropagation()
    setState('ping')
    setPing(null)
    setSpeed(null)

    try {
      // Ping — 5 samples
      const times: number[] = []
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now()
        await fetch(`${probeUrl}/ping?i=${i}&t=${Date.now()}`, { cache: 'no-store' })
        times.push(performance.now() - t0)
      }
      const measuredPing = Math.round(times.reduce((a, b) => a + b) / times.length)
      setPing(measuredPing)

      // Download — 10 MB
      setState('download')
      const t0 = performance.now()
      const res = await fetch(`${probeUrl}/garbage?ckSize=10&t=${Date.now()}`, { cache: 'no-store' })
      const buf = await res.arrayBuffer()
      const secs = (performance.now() - t0) / 1000
      const measuredSpeed = Math.round((buf.byteLength * 8 / secs / 1024 / 1024) * 10) / 10

      setSpeed(measuredSpeed)
      writeCache(cacheKey, { ping: measuredPing, speed: measuredSpeed, ts: Date.now() })
      setState('done')
    } catch {
      setState('error')
    }
  }

  // ── idle (no cache) ───────────────────────────────────────────
  if (state === 'idle') return (
    <button
      onClick={run}
      className="chip whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity"
      style={{ background: 'var(--blue-100)' }}
    >
      <Wifi className="w-3 h-3 shrink-0" strokeWidth={2.5} />
      <span className="text-xs font-bold">Test speed</span>
    </button>
  )

  // ── measuring ─────────────────────────────────────────────────
  if (state === 'ping' || state === 'download') return (
    <span className="chip whitespace-nowrap" style={{ background: 'var(--blue-100)' }}>
      <RefreshCw className="w-3 h-3 shrink-0 animate-spin" strokeWidth={2.5} />
      <span className="text-xs font-bold">
        {state === 'ping' ? 'Ping…' : '↓ Speed…'}
      </span>
    </span>
  )

  // ── error ─────────────────────────────────────────────────────
  if (state === 'error') return (
    <button
      onClick={run}
      className="chip whitespace-nowrap cursor-pointer"
      style={{ background: '#fee2e2', color: '#dc2626' }}
    >
      <Wifi className="w-3 h-3 shrink-0" strokeWidth={2.5} />
      <span className="text-xs font-bold">Retry</span>
    </button>
  )

  // ── cached or done ────────────────────────────────────────────
  const pingBg =
    ping! < 80  ? 'var(--green-100)' :
    ping! < 150 ? 'var(--yellow)'    : '#fee2e2'

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        onClick={run}
        className="chip whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity"
        style={{ background: pingBg }}
        title={state === 'cached' ? 'Last measured — click to retest' : 'Click to retest'}
      >
        <Zap className="w-3 h-3 shrink-0" strokeWidth={3} />
        <span className="text-xs font-bold tabular-nums">{ping} ms</span>
        {state === 'cached' && (
          <RefreshCw className="w-2.5 h-2.5 shrink-0 opacity-40" strokeWidth={2.5} />
        )}
      </button>
      {speed !== null && (
        <span className="chip whitespace-nowrap" style={{ background: 'var(--green-100)' }}>
          <span className="text-xs font-bold tabular-nums">↓ {speed} Mbps</span>
        </span>
      )}
    </div>
  )
}
