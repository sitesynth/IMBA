'use client'
import { Fragment, useMemo, useState } from 'react'
import { Check, Copy, Search } from 'lucide-react'
import { usd } from '../types'

export interface EsimCountry { code: string; name: string; packages: number; from_price_usd: number }
interface Pkg { sku: string; name: string; data_gb: number; duration_days: number; speed: string | null; price_usd: number }

// Regional-indicator flag for an ISO-2 code (a globe when the code is not one), same as the eSIM storefront
function flag(code: string) {
  const c = code.toUpperCase()
  if (!/^[A-Z]{2}$/.test(c)) return '🌐'
  return String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65, 0x1f1e6 + c.charCodeAt(1) - 65)
}

export function PricingClient({ countries }: { countries: EsimCountry[] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [cache, setCache] = useState<Record<string, Pkg[]>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q) : countries
  }, [countries, query])

  async function toggle(code: string) {
    if (open === code) { setOpen(null); return }
    setOpen(code); setError('')
    if (cache[code]) return
    setLoading(code)
    try {
      const res = await fetch(`/api/v1/me/api/pricing/esim?country=${code}`)
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.detail || `Request failed (${res.status})`)
      setCache((c) => ({ ...c, [code]: body.packages as Pkg[] }))
    } catch (e) {
      setError((e as Error).message)
      setOpen(null)
    } finally {
      setLoading(null)
    }
  }

  async function copy(sku: string) {
    try { await navigator.clipboard.writeText(sku); setCopied(sku); setTimeout(() => setCopied(''), 1500) } catch {}
  }

  return (
    <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="px-5 py-4 border-b-2 border-ink flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" strokeWidth={2.5} />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a country"
            className="w-full pl-10 pr-4 py-2.5 border-2 border-ink rounded-full font-semibold text-sm bg-cream focus:bg-paper transition-colors"
            aria-label="Search a country"
          />
        </div>
        <span className="text-sm font-semibold text-ink/60">{shown.length} of {countries.length} countries</span>
      </div>
      {error && <div className="px-5 py-3 font-bold text-sm" style={{ background: '#FFD7D7' }}>{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-ink/60 border-b-2 border-ink">
              <th className="px-5 py-3">Country</th>
              <th className="px-5 py-3 text-right">Packages</th>
              <th className="px-5 py-3 text-right">From</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-8 text-center font-semibold text-ink/60">No country matches.</td></tr>
            )}
            {shown.map((c) => (
              <Fragment key={c.code}>
                <tr
                  onClick={() => toggle(c.code)}
                  className="border-t border-ink/15 cursor-pointer hover:bg-cream"
                  aria-expanded={open === c.code}
                >
                  <td className="px-5 py-3 font-extrabold"><span className="text-xl mr-2.5 align-middle" aria-hidden="true">{flag(c.code)}</span>{c.name} <span className="text-ink/40 font-semibold">{c.code}</span></td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">{c.packages}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-extrabold">{usd(c.from_price_usd)}</td>
                </tr>
                {open === c.code && (
                  <tr key={`${c.code}-pk`} className="bg-cream">
                    <td colSpan={3} className="px-5 py-4">
                      {loading === c.code || !cache[c.code] ? (
                        <p className="font-semibold text-ink/60">Loading packages…</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-ink/60">
                                <th className="py-2 pr-4">Data</th>
                                <th className="py-2 pr-4">Days</th>
                                <th className="py-2 pr-4 text-right">Price</th>
                                <th className="py-2 pl-4">SKU</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cache[c.code].map((p) => (
                                <tr key={p.sku} className="border-t border-ink/15">
                                  <td className="py-2 pr-4 font-semibold">{p.data_gb} GB</td>
                                  <td className="py-2 pr-4 font-semibold tabular-nums">{p.duration_days}</td>
                                  <td className="py-2 pr-4 text-right font-extrabold tabular-nums">{usd(p.price_usd)}</td>
                                  <td className="py-2 pl-4">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); copy(p.sku) }}
                                      className="inline-flex items-center gap-1.5 font-mono text-xs bg-paper border-2 border-ink rounded-xl px-2.5 py-1"
                                      aria-label={`Copy SKU ${p.sku}`}
                                    >
                                      {copied === p.sku ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />}
                                      {p.sku}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
