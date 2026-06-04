'use client'

// IMBA SVG letterform mask (same viewBox as the original SVG)
const MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4.3 147.8 1419.1 470.8">
  <rect x="-4.3" y="147.8" width="235.4" height="470.8" fill="white"/>
  <path fill="white" d="M483.5,353.2c-2.6,28.2-30.1,27.9-32.4-.3l-18.9-203.3-168.5-1.5v470.4h113.7l1.9-263.8c.2-28.2,28-31,30.7-3l25.8,266.9h61.8l25.8-266.6c2.7-27.9,30.5-25.2,30.7,3l1.9,263.6h132.2V148.1l-185,1.5-19.5,203.6h-.2Z"/>
  <path fill="white" d="M1009.7,148.3h-289.2v469.9h289.2c22.4,0,40.6-27.6,40.6-61.6v-96.1c0-34-18.2-61.6-40.6-61.6h-53.5c-8.7-1.5-15.4-12.8-15.4-26.3s7.3-25.7,16.5-26.4h52.4c22.4,0,40.6-27.6,40.6-61.6v-74.4c0-34-18.2-61.6-40.6-61.6h0ZM899.3,509.8c0,14-7.5,25.4-16.7,25.4h-15.3c-9.2,0-16.7-11.4-16.7-25.4v-65.6c0-20.5,10.9-37,24.4-37s24.4,16.6,24.4,37v65.6h-.1ZM899.3,329.3c0,14-7.5,25.4-16.7,25.4h-15.3c-9.2,0-16.7-11.4-16.7-25.4v-60c0-20.5,10.9-37,24.4-37s24.4,16.6,24.4,37v60h-.1Z"/>
  <path fill="white" d="M1367.7,147.8h-240.5c-24.9,0-45.1,30.6-45.1,68.3v402.3h141v-95.3c0-14,7.5-25.4,16.7-25.4h15.3c9.2,0,16.7,11.4,16.7,25.4v95.3h141V216.1c0-37.7-20.2-68.3-45.1-68.3h0ZM1271.8,311.6v60c0,14-7.5,25.4-16.7,25.4h-15.3c-9.2,0-16.7-11.4-16.7-25.4v-88.2c0-20.5,10.9-37,24.4-37s24.4,16.6,24.4,37v28.1h-.1Z"/>
</svg>`

const MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(MASK_SVG)}")`

// Pre-computed 25 beam configs (emulates SCSS random() for 6 color combos)
const PURPLE = 'rgb(232,121,249)'
const BLUE   = 'rgb(96,165,250)'
const GREEN  = 'rgb(94,234,212)'
const YELLOW = 'rgb(250,204,21)'

const COMBOS = [
  [PURPLE, BLUE, GREEN],
  [PURPLE, GREEN, BLUE],
  [GREEN,  PURPLE, BLUE],
  [GREEN,  BLUE, PURPLE],
  [BLUE,   GREEN, PURPLE],
  [BLUE,   PURPLE, GREEN],
]

const TOTAL   = 25
const ANIM_S  = 45  // seconds

const beams = Array.from({ length: TOTAL }, (_, i) => {
  const c = COMBOS[i % COMBOS.length]
  const duration = ANIM_S - (ANIM_S / TOTAL / 2) * (i + 1)
  const delay    = -((i + 1) / TOTAL * ANIM_S)
  const shadow = [
    `-130px 0 80px 40px ${YELLOW}`,
    `-50px 0 50px 25px ${c[0]}`,
    `0 0 50px 25px ${c[1]}`,
    `50px 0 50px 25px ${c[2]}`,
    `130px 0 80px 40px white`,
  ].join(', ')
  return { shadow, duration, delay }
})

export function RainbowImbaLogo({
  style,
}: {
  style?: React.CSSProperties
}) {
  return (
    <>
      <style>{`
        @keyframes rainbow-slide {
          from { right: -25vw; }
          to   { right: 125vw; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rb-beam { animation: none !important; right: 50vw !important; }
        }
      `}</style>

      <span
        aria-hidden="true"
        style={{
          display: 'block',
          overflow: 'hidden',
          position: 'relative',
          WebkitMaskImage: MASK_URL,
          maskImage: MASK_URL,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          background: 'white',
          ...style,
        }}
      >
        {beams.map((b, i) => (
          <span
            key={i}
            className="rb-beam"
            style={{
              position: 'absolute',
              top: 0,
              height: '200%',
              width: 0,
              transform: 'rotate(10deg)',
              transformOrigin: 'top right',
              boxShadow: b.shadow,
              animation: `rainbow-slide ${b.duration}s linear infinite`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </span>
    </>
  )
}
