import Link from 'next/link'

/**
 * IMBA logo lockup.
 * - `tone="yellow"` (default): black wordmark on a yellow plate.
 * - `tone="blue"`: white wordmark on a bright-blue plate.
 * - `plate={false}`: bare wordmark; pick `variant` to match the surface.
 */
export function Logo({
  href = '/',
  size = 'md',
  plate = true,
  tone = 'yellow',
  variant,
}: {
  href?: string | null
  size?: 'sm' | 'md' | 'lg'
  plate?: boolean
  tone?: 'yellow' | 'blue'
  variant?: 'black' | 'white'
}) {
  const h = size === 'lg' ? 24 : size === 'sm' ? 15 : 19
  // On a blue plate the wordmark is white; on yellow it's black.
  const mark = variant ?? (plate && tone === 'blue' ? 'white' : 'black')
  const src = mark === 'white' ? '/imba-white.svg' : '/imba-black.svg'

  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={src} alt="IMBA" style={{ height: h, width: 'auto', display: 'block' }} />

  const inner = plate ? (
    <span className={`logo-badge ${tone === 'blue' ? 'logo-badge--blue' : ''}`} style={{ padding: '0.5em 0.62em' }}>
      {img}
    </span>
  ) : (
    img
  )

  if (href === null) return inner
  return (
    <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
      {inner}
    </Link>
  )
}
