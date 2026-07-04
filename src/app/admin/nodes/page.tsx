'use client'
import { useState } from 'react'
import { Server } from 'lucide-react'
import { NodeDiagnostics, DiagnosticData, AttackReport } from '@/components/NodeDiagnostics'
import { getAdminToken } from '@/lib/admin-api'

const VPN_NODES = [
  { host: '31.70.101.181', city: '🇩🇪 Berlin' },
  { host: '38.19.201.176', city: '🇵🇹 Lisbon' },
  { host: '209.151.155.228', city: '🇺🇸 New York' },
]

// Route through the Next.js proxy (/api/v1/…) to avoid CORS and inject auth
async function adminFetch<T>(path: string): Promise<T> {
  const token = getAdminToken()
  const proxyPath = path.replace(/^\/v1\//, '/api/v1/')
  const res = await fetch(proxyPath, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function NodesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">VPN Nodes</h1>
        <p className="text-sm text-gray-500">Node diagnostics &amp; security</p>
      </div>

      {VPN_NODES.map((node) => (
        <div key={node.host} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-gray-600" strokeWidth={2} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{node.city}</h2>
              <p className="text-xs font-mono text-gray-400">{node.host}</p>
            </div>
          </div>

          <NodeDiagnostics
            host={node.host}
            fetchDiagnostic={(h) => adminFetch<DiagnosticData>(`/v1/admin/nodes/${h}/diagnose`)}
            fetchReport={(h, hours) => adminFetch<AttackReport>(`/v1/admin/nodes/${h}/report?hours=${hours}`)}
          />
        </div>
      ))}
    </div>
  )
}
