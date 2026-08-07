'use client'
import { useState, useCallback } from 'react'
import { Wifi, Zap, RefreshCw } from 'lucide-react'

const BASE = 'https://38-19-201-176.sslip.io/speedtest'

type State = 'idle' | 'pinging' | 'downloading' | 'done' | 'error'

export function ServerSpeedTest() {
  const [state, setState] = useState<State>('idle')
  const [ping, setPing] = useState<number | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)

  const run = useCallback(async () => {
    setState('pinging')
    setPing(null)
    setSpeed(null)

    try {
      // Ping: avg of 5 round trips
      const pings: number[] = []
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now()
        await fetch(`${BASE}/ping?t=${Date.now()}`, { cache: 'no-store' })
        pings.push(performance.now() - t0)
      }
      const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length)
      setPing(avgPing)

      // Download: 10MB test file
      setState('downloading')
      const t0 = performance.now()
      const res = await fetch(`${BASE}/garbage?ckSize=10&t=${Date.now()}`, { cache: 'no-store' })
      const buf = await res.arrayBuffer()
      const elapsed = (performance.now() - t0) / 1000
      const mbps = (buf.byteLength / elapsed) / (1024 * 1024)
      setSpeed(Math.round(mbps * 10) / 10)

      setState('done')
    } catch {
      setState('error')
    }
  }, [])

  const pingColor =
    ping === null ? '' :
    ping < 80 ? 'text-green-600' :
    ping < 150 ? 'text-yellow-600' : 'text-red-500'

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Ping */}
      <div className="flex items-center gap-1.5">
        <Wifi className="w-4 h-4 text-ink/40" strokeWidth={2} />
        <span className={`text-sm font-bold tabular-nums ${pingColor || 'text-ink/40'}`}>
          {ping !== null ? `${ping} ms` : '— ms'}
        </span>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-ink/40" strokeWidth={2} />
        <span className="text-sm font-bold tabular-nums text-ink/40">
          {speed !== null ? (
            <span className="text-ink">{speed} MB/s</span>
          ) : '— MB/s'}
        </span>
      </div>

      {/* Button */}
      <button
        onClick={run}
        disabled={state === 'pinging' || state === 'downloading'}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-ink/20 hover:border-ink/40 disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${state === 'pinging' || state === 'downloading' ? 'animate-spin' : ''}`} />
        {state === 'idle' ? 'Test speed' :
         state === 'pinging' ? 'Pinging…' :
         state === 'downloading' ? 'Testing…' :
         state === 'error' ? 'Retry' : 'Retest'}
      </button>

      {state === 'error' && (
        <span className="text-xs text-red-500">Connection failed</span>
      )}
    </div>
  )
}
