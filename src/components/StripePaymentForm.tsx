'use client'

import { useState } from 'react'
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import { createPaymentIntent, getStripe } from '@/lib/stripe-client'
import { Plus } from 'lucide-react'

const stripePromise = getStripe()

interface StripePaymentFormProps {
  amount: number
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
}

function PaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      // Create payment intent
      const intentData = await createPaymentIntent(amount)

      // Confirm payment with card
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      )

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        onError?.(confirmError.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess?.(intentData.payment_id)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment error'
      setError(message)
      onError?.(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="pill pill-ink w-full justify-center"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}
