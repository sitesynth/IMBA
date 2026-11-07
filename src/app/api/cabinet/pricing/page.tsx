import type { Metadata } from 'next'
import { api } from '@/lib/api'
import { usd } from '../types'
import { PricingClient, type EsimCountry } from './PricingClient'

export const metadata: Metadata = { title: 'Pricing' }

interface VpnCatalog { plans: { months: number; price_usd: number }[] }
interface EsimCatalog { countries: EsimCountry[] }

export default async function PricingPage() {
  const [vpn, esim] = await Promise.all([
    api.get<VpnCatalog>('/v1/me/api/pricing/vpn').catch(() => null),
    api.get<EsimCatalog>('/v1/me/api/pricing/esim').catch(() => null),
  ])

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="display text-4xl">Pricing</h1>
        <p className="font-semibold text-ink/60 mt-2">
          Your prices in US dollars: exactly what the catalog endpoints return for your key and what an order is charged.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="display text-2xl">VPN</h2>
        {vpn ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vpn.plans.map((p) => (
              <div key={p.months} className="panel">
                <span className="chip" style={{ background: 'var(--yellow)' }}>{p.months} {p.months === 1 ? 'month' : 'months'}</span>
                <div className="display text-3xl mt-4 tabular-nums">{usd(p.price_usd)}</div>
                <div className="font-semibold text-ink/60 text-sm mt-2">{usd(p.price_usd / p.months)} per month</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel"><p className="font-semibold">Could not load VPN prices. Reload the page in a moment.</p></div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl">eSIM</h2>
        {esim ? (
          <PricingClient countries={esim.countries} />
        ) : (
          <div className="panel"><p className="font-semibold">Could not load eSIM prices. Reload the page in a moment.</p></div>
        )}
      </section>
    </div>
  )
}
