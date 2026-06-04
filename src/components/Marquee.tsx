export function Marquee({ items, bg }: { items: string[]; bg: string }) {
  const row = [...items, ...items]
  return (
    <div className="marquee border-y-2 border-ink py-2.5" style={{ background: bg }} aria-hidden="true">
      <div className="marquee__track">
        {row.map((t, i) => (
          <span
            key={i}
            className="marquee__item text-sm md:text-base px-5"
            style={{
              fontFamily: 'var(--font-display), Impact, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              textWrap: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {t}
            <span style={{ opacity: 0.55 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
