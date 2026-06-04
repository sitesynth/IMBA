export function SkyBackground() {
  const clouds = [
    { top: '8%',  width: 220, speed: 38, delay: 0,    opacity: 0.92 },
    { top: '18%', width: 160, speed: 55, delay: -12,   opacity: 0.80 },
    { top: '32%', width: 280, speed: 44, delay: -22,   opacity: 0.88 },
    { top: '50%', width: 130, speed: 62, delay: -8,    opacity: 0.70 },
    { top: '62%', width: 200, speed: 50, delay: -35,   opacity: 0.85 },
    { top: '72%', width: 170, speed: 41, delay: -18,   opacity: 0.75 },
    { top: '14%', width: 310, speed: 70, delay: -45,   opacity: 0.65 },
    { top: '44%', width: 240, speed: 48, delay: -28,   opacity: 0.82 },
  ]

  return (
    <>
      <style>{`
        @keyframes cloud-drift {
          from { transform: translateX(-120%); }
          to   { transform: translateX(calc(100vw + 120%)); }
        }
        .cloud-puff {
          position: absolute;
          border-radius: 50%;
          background: white;
        }
        @media (prefers-reduced-motion: reduce) {
          .sky-cloud { animation: none !important; left: 30% !important; }
        }
      `}</style>

      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #5BC8F5 0%, #3AAEE0 35%, #1A8CCA 70%, #0F6BAA 100%)',
        }}
      />

      {/* Subtle sun glow top-right */}
      <div
        className="absolute"
        style={{
          top: '-10%', right: '10%',
          width: 320, height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,180,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Clouds */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="sky-cloud"
          style={{
            position: 'absolute',
            top: c.top,
            left: 0,
            width: c.width,
            height: c.width * 0.45,
            opacity: c.opacity,
            animation: `cloud-drift ${c.speed}s linear infinite`,
            animationDelay: `${c.delay}s`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Fluffy cloud made of overlapping circles */}
          <div className="cloud-puff" style={{ width: '55%', height: '80%', bottom: 0, left: '22%' }} />
          <div className="cloud-puff" style={{ width: '40%', height: '70%', bottom: 0, left: '5%' }} />
          <div className="cloud-puff" style={{ width: '45%', height: '75%', bottom: 0, right: '5%' }} />
          <div className="cloud-puff" style={{ width: '35%', height: '60%', bottom: '15%', left: '38%' }} />
          <div className="cloud-puff" style={{ width: '100%', height: '45%', bottom: 0, left: 0 }} />
        </div>
      ))}
    </>
  )
}
