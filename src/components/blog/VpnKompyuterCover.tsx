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
        <div style={{ position: 'absolute', right: '2%', top: '0%', width: '46%', bottom: '0%', pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <Lottie animationData={animData} loop style={{ width: '90%', marginLeft: '-10%' }} />
            {/* IMBA logo on laptop screen */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/imba-black.svg"
              alt=""
              style={{
                position: 'absolute',
                top: '22%',
                left: '34%',
                width: '22%',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
