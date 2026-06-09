'use client'

import { api } from './api'

let stripePromise: Promise<any> | null = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = (async () => {
      const Stripe = (window as any).Stripe
      if (!Stripe) {
        // Script not loaded yet, try loading from CDN
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        document.head.appendChild(script)

        return new Promise((resolve) => {
          script.onload = () => {
            resolve((window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''))
          }
        })
      }
      return Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
    })()
  }
  return stripePromise
}

export interface CreatePaymentIntentResponse {
  payment_intent_id: string
  client_secret: string
  publishable_key?: string
  payment_id: string
}

export async function createPaymentIntent(amount: number): Promise<CreatePaymentIntentResponse> {
  return api.post('/v1/payments/create-intent', {
    amount,
  })
}

export async function confirmPayment(paymentIntentId: string): Promise<any> {
  return api.post('/v1/payments/confirm', {
    payment_intent_id: paymentIntentId,
  })
}
