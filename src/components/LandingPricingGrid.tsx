import Link from 'next/link'

type Tariff = {
  months: number
  price_rub: number
  total_rub: number
  total_usd: number
  badge: 'popular' | 'best_value' | null
}

const BADGE: Record<string, { label: string; bg: string }> = {
  popular:    { label: '🔥 Popular',    bg: 'var(--yellow)' },
  best_value: { label: '✨ Best Value', bg: 'var(--green)' },
}

const CARD_BG: Record<string, string> = {
  popular:    'var(--yellow-100, #fefce8)',
  best_value: 'var(--green-100, #dcfce7)',
}

function monthLabel(n: number) {
  return n === 1 ? '1 month' : `${n} months`
}

async function fetchTariffs(): Promise<Tariff[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.imba.live'}/v1/me/vpn/tariffs`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function LandingPricingGrid() {
  const tariffs = await fetchTariffs()
  if (!tariffs.length) return null

  return (
    <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="display text-3xl md:text-5xl mb-2">VPN plans</h2>
        <p className="text-base font-medium text-ink/60 mb-8">Pick a plan — longer = cheaper per month</p>

        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
          {tariffs.map((t) => {
            const pricePerMonth = (t.total_usd / t.months).toFixed(2)
            const cardBg = t.badge ? CARD_BG[t.badge] : 'var(--paper)'
            const badge = t.badge ? BADGE[t.badge] : null

            return (
              <div
                key={t.months}
                className="relative rounded-3xl border-2 border-ink p-5 flex flex-col gap-4"
                style={{ background: cardBg, boxShadow: t.badge === 'best_value' ? '4px 4px 0 #111' : undefined }}
              >
                {badge && (
                  <span
                    className="absolute -top-3 left-4 chip text-[11px] py-1"
                    style={{ background: badge.bg }}
                  >
                    {badge.label}
                  </span>
                )}

                <div>
                  <div className="text-sm font-extrabold text-ink/60 mb-1">{monthLabel(t.months)}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="display text-3xl">${pricePerMonth}</span>
                    <span className="text-sm font-bold text-ink/40">/mo</span>
                  </div>
                  <div className="text-xs font-semibold text-ink/50 mt-0.5">
                    Total ${t.total_usd.toFixed(2)}
                  </div>
                </div>

                <Link
                  href={`/auth/register?vpn_plan=${t.months}`}
                  className="pill pill-ink w-full justify-center text-sm"
                >
                  Select →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
