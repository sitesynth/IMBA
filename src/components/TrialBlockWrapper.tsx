'use client'
import { Suspense } from 'react'
import { TrialBlock } from './TrialBlock'
import type { FxRates } from '@/lib/types'

// Client wrapper so the server-rendered VPN page can mount TrialBlock (it needs function props).
export function TrialBlockWrapper({ currency, rates }: { currency: string; rates: FxRates }) {
  return (
    <Suspense fallback={null}>
      <TrialBlock
        onActivated={() => window.location.reload()}
        onPromoApplied={() => window.location.reload()}
        currency={currency}
        rates={rates}
      />
    </Suspense>
  )
}
