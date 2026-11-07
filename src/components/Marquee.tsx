export function Marquee({ items, bg, textColor }: { items: string[]; bg: string; textColor?: string }) {
  // Two identical halves make the -50% loop seamless; each half must be wider than the screen,
  // so a short list is repeated (a 5-word ticker is narrower than a wide monitor).
  const half = [...items, ...items, ...items]
  const row = [...half, ...half]
  const style: React.CSSProperties = {
    fontFamily: 'var(--font-display), Impact, sans-serif',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    color: textColor,
  }
  return (
    <div className="marquee py-2.5" style={{ background: bg }} aria-hidden="true">
      <div className="marquee__track">
        {row.map((t, i) => (
          <span key={i} className="marquee__item text-sm md:text-base inline-flex items-center">
            <span className="px-5" style={style}>{t}</span>
            <span style={{ opacity: 0.5, fontSize: '0.9em' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
