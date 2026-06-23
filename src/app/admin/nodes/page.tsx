import { redirect } from 'next/navigation'
import { Server } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { api } from '@/lib/api'
import { NodeDiagnostics, DiagnosticData, AttackReport } from '@/components/NodeDiagnostics'

const VPN_NODES = [
  { host: '31.70.101.181', city: '🇩🇪 Berlin' },
  { host: '38.19.201.176', city: '🇵🇹 Lisbon' },
  { host: '209.151.155.228', city: '🇺🇸 New York' },
]

async function getDiagnostic(host: string) {
  'use server'
  const data = await api.get(`/v1/admin/nodes/${host}/diagnose`)
  return data
}

async function getReport(host: string) {
  'use server'
  const data = await api.get(`/v1/admin/nodes/${host}/report?hours=24`)
  return data
}

export default async function NodesPage() {
  const user = await getCurrentUser()
  if (!user || !user.email?.endsWith('@imba.live')) redirect('/dashboard')

  return (
    <div className="fade-up space-y-6">
      <div>
        <h1 className="display text-4xl md:text-5xl mb-1">VPN Nodes</h1>
        <p className="font-semibold text-ink/60">node-accelerator diagnostics & security</p>
      </div>

      {VPN_NODES.map((node) => (
        <div key={node.host} className="panel" style={{ background: 'var(--paper)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6" strokeWidth={2} />
            <div>
              <h2 className="display text-2xl">{node.city}</h2>
              <p className="text-xs font-mono font-bold text-ink/50">{node.host}</p>
            </div>
          </div>

          <NodeDiagnostics
            host={node.host}
            fetchDiagnostic={(h) => api.get<DiagnosticData>(`/v1/admin/nodes/${h}/diagnose`)}
            fetchReport={(h, hours) => api.get<AttackReport>(`/v1/admin/nodes/${h}/report?hours=${hours}`)}
          />
        </div>
      ))}
    </div>
  )
}
