'use client'

import { loadStripe, Stripe } from '@stripe/js'
import { api } from './api'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}

export interface CreatePaymentIntentResponse {
  payment_intent_id: string
  client_secret: string
  publishable_key: string
  payment_id: string
}

export async function createPaymentIntent(amount: number): Promise<CreatePaymentIntentResponse> {
  return api.post('/v1/payments/create-intent', {
    amount,
  })
}

export async function confirmPayment(paymentIntentId: string) {
  return api.post('/v1/payments/confirm', {
    payment_intent_id: paymentIntentId,
  })
}
