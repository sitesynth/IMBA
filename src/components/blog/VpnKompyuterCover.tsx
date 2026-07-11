'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

export function VpnKompyuterCover() {
  const [animData, setAnimData] = useState<object | null>(null)

  useEffect(() => {
    fetch('/blog/laptop-working.json')
      .then((r) => r.json())
      .then(setAnimData)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/blog/laptop-vpn-russia-2026.svg" className="w-full" alt="VPN на компьютер — Windows и macOS" />
      {animData && (
        <div style={{ position: 'absolute', right: '3%', top: '8%', width: '36%', height: '84%', pointerEvents: 'none' }}>
          <Lottie animationData={animData} loop style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </div>
  )
}
