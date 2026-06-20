'use client'

import { useEffect, useRef, useState } from 'react'

export function AnimatedBalance({ balance, className }: { balance: number; className?: string }) {
  const prevRef = useRef<number | null>(null)
  const [display, setDisplay] = useState(balance)
  const [animating, setAnimating] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = balance

    if (prev === null || prev === balance) {
      setDisplay(balance)
      return
    }

    // Animate from prev → balance
    setAnimating(true)
    const start = performance.now()
    const duration = 900
    const from = prev
    const to = balance

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (to - from) * eased)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(to)
        setAnimating(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [balance])

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        transition: 'color 0.3s',
        color: animating ? 'var(--red, #e53e3e)' : undefined,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      ${display.toFixed(2)}
    </span>
  )
}
