import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'IMBA — eSIM, VPN и виртуальная карта'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '24px',
          gap: '24px',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Main content block */}
        <div
          style={{
            flex: 1,
            background: '#2E7DF6',
            borderRadius: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              background: '#FFD731',
              border: '3px solid #111111',
              borderRadius: '16px',
              padding: '14px 28px',
              marginBottom: '40px',
              display: 'flex',
            }}
          >
            <span style={{ fontSize: 52, fontWeight: 900, color: '#111111', letterSpacing: '-2px' }}>
              IMBA
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              textAlign: 'center',
              lineHeight: 1,
              marginBottom: 24,
            }}
          >
            Твой интернет. Без границ.
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 16 }}>
            {['eSIM', 'VPN', 'Карта'].map((tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: 999,
                  padding: '10px 28px',
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
