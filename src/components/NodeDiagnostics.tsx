'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

type DiagnosticData = {
  host: string
  health: string
  kernel: string | null
  bbr_enabled: boolean
  tcp_ecn: string | null
  conntrack_usage: { current: number; max: number } | null
  tcp_retransmits: number | null
  issues: string[]
}

type AttackReport = {
  host: string
  hours: number
  total_drops: number
  top_reasons: Record<string, number>
  top_ips: { ip: string; verdict: string; drops: number }[]
  timeline: { time: string; count: number }[]
}

const healthColors: Record<string, string> = {
  healthy: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
}

const healthBg: Record<string, string> = {
  healthy: 'bg-green-100',
  warning: 'bg-yellow-100',
  error: 'bg-red-100',
}

export function NodeDiagnostics({
  host,
  fetchDiagnostic,
  fetchReport,
}: {
  host: string
  fetchDiagnostic: (host: string) => Promise<DiagnosticData>
  fetchReport: (host: string, hours: number) => Promise<AttackReport>
}) {
  const [diag, setDiag] = useState<DiagnosticData | null>(null)
  const [report, setReport] = useState<AttackReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'health' | 'attacks'>('health')

  async function loadDiagnostic() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDiagnostic(host)
      setDiag(data)
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to fetch diagnostic')
    } finally {
      setLoading(false)
    }
  }

  async function loadReport() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReport(host, 24)
      setReport(data)
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to fetch report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('health')}
          className={`pill pill-sm ${activeTab === 'health' ? 'pill-ink' : 'pill-paper'}`}
        >
          🩺 Health
        </button>
        <button
          onClick={() => setActiveTab('attacks')}
          className={`pill pill-sm ${activeTab === 'attacks' ? 'pill-ink' : 'pill-paper'}`}
        >
          🔥 Attacks
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="panel" style={{ background: 'var(--red)' }}>
          <p className="text-sm font-bold text-white">{error}</p>
        </div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <button
            onClick={loadDiagnostic}
            disabled={loading}
            className="pill pill-ink pill-sm"
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>

          {diag && (
            <>
              {/* Health Status */}
              <div
                className={`panel flex items-center justify-between ${healthBg[diag.health]}`}
              >
                <div>
                  <h3 className="display text-lg font-bold">System Health</h3>
                  <p className={`text-sm font-bold ${healthColors[diag.health]}`}>
                    {diag.health.toUpperCase()}
                  </p>
                </div>
                {diag.health === 'healthy' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" strokeWidth={2} />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-600" strokeWidth={2} />
                )}
              </div>

              {/* Issues */}
              {diag.issues.length > 0 && (
                <div className="panel" style={{ background: 'var(--paper)' }}>
                  <h4 className="font-bold text-sm mb-2">⚠️ Issues</h4>
                  <ul className="space-y-1">
                    {diag.issues.map((issue, i) => (
                      <li key={i} className="text-xs font-semibold text-ink/70">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              <div className="grid md:grid-cols-2 gap-3">
                {diag.kernel && (
                  <div className="panel" style={{ background: 'var(--paper)' }}>
                    <p className="text-xs font-bold text-ink/60 mb-1">Kernel</p>
                    <p className="text-sm font-mono font-bold truncate">{diag.kernel}</p>
                  </div>
                )}

                <div className="panel" style={{ background: 'var(--paper)' }}>
                  <p className="text-xs font-bold text-ink/60 mb-1">BBR</p>
                  <p className="text-sm font-bold">
                    {diag.bbr_enabled ? '✅ Enabled' : '❌ Disabled'}
                  </p>
                </div>

                {diag.conntrack_usage && (
                  <div className="panel" style={{ background: 'var(--paper)' }}>
                    <p className="text-xs font-bold text-ink/60 mb-2">Conntrack</p>
                    <div className="mb-1 flex justify-between text-xs font-bold">
                      <span>
                        {diag.conntrack_usage.current} / {diag.conntrack_usage.max}
                      </span>
                      <span className="text-ink/40">
                        {Math.round(
                          (diag.conntrack_usage.current / diag.conntrack_usage.max) * 100,
                        )}%
                      </span>
                    </div>
                    <div
                      className="h-2 bg-ink/20 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-ink"
                        style={{
                          width: `${(diag.conntrack_usage.current / diag.conntrack_usage.max) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {diag.tcp_retransmits !== null && (
                  <div className="panel" style={{ background: 'var(--paper)' }}>
                    <p className="text-xs font-bold text-ink/60 mb-1">TCP Retransmits</p>
                    <p className="text-sm font-bold">{diag.tcp_retransmits}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Attacks Tab */}
      {activeTab === 'attacks' && (
        <div className="space-y-4">
          <button
            onClick={loadReport}
            disabled={loading}
            className="pill pill-ink pill-sm"
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>

          {report && (
            <>
              {/* Total Drops */}
              <div className="panel" style={{ background: 'var(--yellow-100)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink/60 mb-1">
                      Last {report.hours}h
                    </p>
                    <div className="display text-3xl font-bold">
                      {report.total_drops.toLocaleString()}
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-ink/40" strokeWidth={2} />
                </div>
              </div>

              {/* Top Reasons */}
              {Object.keys(report.top_reasons).length > 0 && (
                <div className="panel" style={{ background: 'var(--paper)' }}>
                  <h4 className="font-bold text-sm mb-3">📊 Top Drop Reasons</h4>
                  <div className="space-y-2">
                    {Object.entries(report.top_reasons)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([reason, count]) => (
                        <div
                          key={reason}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-semibold text-ink/70">{reason}</span>
                          <span className="font-bold">{count.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Top IPs */}
              {report.top_ips.length > 0 && (
                <div className="panel" style={{ background: 'var(--paper)' }}>
                  <h4 className="font-bold text-sm mb-3">🚨 Top Attackers</h4>
                  <div className="space-y-2">
                    {report.top_ips.slice(0, 10).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-mono font-bold text-xs">{item.ip}</p>
                          <p className="text-xs text-ink/50">{item.verdict}</p>
                        </div>
                        <span className="font-bold">{item.drops.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
