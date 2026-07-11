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
        <div style={{ position: 'absolute', right: '2%', top: '28%', width: '46%', bottom: '0%', pointerEvents: 'none', overflow: 'hidden' }}>
          <Lottie animationData={animData} loop style={{ width: '110%', marginLeft: '-5%' }} />
        </div>
      )}
    </div>
  )
}
